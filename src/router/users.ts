import express from "express";

import {
  getAllUsers,
  deleteUser,
  updateUser,
  getUser,
  createNewUser,
} from "../controllers/users";

import { authorizeEditUserAccess, isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.post("/users", isAuthenticated, createNewUser);
  router.get("/users/:id", isAuthenticated, getUser);
  router.delete(
    "/users/:id",
    isAuthenticated,
    authorizeEditUserAccess,
    deleteUser
  );
  router.patch(
    "/users/:id",
    isAuthenticated,
    authorizeEditUserAccess,
    updateUser
  );
};
