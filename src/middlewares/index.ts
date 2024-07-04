import express from "express";
import jwt from "jsonwebtoken";
import { merge, get } from "lodash";

import { getSessionByToken } from "../db/sessions";
import { getUserById } from "../db/users";
import { getClientById } from "../db/clients";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["api_auth_token"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      jwt.verify(sessionToken, process.env.JWT_SECRET);
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError) {
        console.error(error);
        return res.status(400).json();
      } else {
        console.error("Invalid token:", error);
        return res.status(400).json();
      }
    }

    const session = await getSessionByToken(sessionToken);

    if (!session) {
      return res.sendStatus(404);
    }

    merge(req, { identity: session.userId });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const authorizeEditUserAccess = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;

    const currentUserId = get(req, "identity");

    if (!currentUserId) {
      return res.sendStatus(404);
    }

    const currentUser = await getUserById(currentUserId);

    if (!currentUser) {
      return res.sendStatus(404);
    }

    const queryUser = await getUserById(id);

    if (currentUserId !== queryUser?.id && currentUser.role !== "admin") {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const authorizeEditClientAccess = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;

    const currentUserId = get(req, "identity");

    if (!currentUserId) {
      return res.sendStatus(404);
    }

    const currentUser = await getUserById(currentUserId);

    if (!currentUser) {
      return res.sendStatus(404);
    }

    const queryClient = await getClientById(id);

    if (currentUserId !== queryClient?.userId && currentUser.role !== "admin") {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
