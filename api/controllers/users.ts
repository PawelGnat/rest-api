import express from "express";
import bcrypt from "bcrypt";

import { normalizeString } from "../helpers";

import {
  createUser,
  deleteUserById,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUserById,
} from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createNewUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res
        .status(400)
        .json("Name, surname, email and password is required");
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await createUser({
      name: normalizeString(name),
      surname: normalizeString(surname),
      email,
      password: hashedPassword,
    });

    return res.status(200).json({ user, message: "User created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    await deleteUserById(id);

    return res.status(200).json("User deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { name, surname, email } = req.body;

    if (!name) {
      return res.status(400).json("Name is required");
    }

    if (!surname) {
      return res.status(400).json("Surname is required");
    }

    if (!email) {
      return res.status(400).json("Email is required");
    }

    const user = await updateUserById(id, {
      name: normalizeString(name),
      surname: normalizeString(surname),
      email,
    });

    return res.status(200).json({ user, message: "User updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
