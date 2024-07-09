import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { normalizeString } from "../helpers";

import { getUserByEmail, createUser } from "../db/users";
import {
  createSession,
  getSessionByUserId,
  updateSession,
} from "../db/sessions";

export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid email or password", status: "warning" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(400)
        .json({ error: "Invalid email or password", status: "warning" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json("Internal server error");
    }

    let token;
    const session = await getSessionByUserId(user.id);

    if (!session) {
      token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      await createSession(token, user.id);
    } else {
      try {
        jwt.verify(session.sessionToken, process.env.JWT_SECRET);
        token = session.sessionToken;
      } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
          token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "12h",
          });

          await updateSession(token, user.id);

          return res
            .status(200)
            .cookie("authorization", token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
              maxAge: 12 * 60 * 60 * 1000,
              path: "/",
            })
            .send({ token, message: "Login successful", status: "success" });
        } else {
          console.error("Invalid token:", error);
          return res
            .status(400)
            .json({ error: "Invalid session token", status: "danger" });
        }
      }
    }

    return res
      .status(200)
      .cookie("authorization", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 12 * 60 * 60 * 1000,
        path: "/",
      })
      .send({ token, message: "Login successful", status: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: "danger" });
  }
};

export const logoutUser = async (
  req: express.Request,
  res: express.Response
) => {
  res.clearCookie("authorization", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.sendStatus(200);
};

export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res
        .status(400)
        .json({ error: "All fields are required", status: "warning" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists", status: "warning" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json("Internal server error");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await createUser({
      name: normalizeString(name),
      surname: normalizeString(surname),
      email,
      password: hashedPassword,
    });

    return res
      .status(200)
      .send({ message: "User registered successfully", status: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: "danger" });
  }
};

export const verifyToken = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const sessionToken = req.cookies["authorization"];

    if (!sessionToken) {
      return res.status(403).json("Internal server error");
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json("Internal server error");
    }

    jwt.verify(
      sessionToken,
      process.env.JWT_SECRET,
      async (err: any, decoded: any) => {
        if (err) {
          return res.status(401).send("Invalid token");
        }

        const userId = decoded.userId;
        const session = await getSessionByUserId(userId);

        if (!session) {
          return res.status(401).send("Session not found");
        }

        res.sendStatus(200);
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: "danger" });
  }
};
