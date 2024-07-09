import express from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
  verifyToken,
} from "../controllers/auth";

export default (router: express.Router) => {
  router.post("/auth/verify", verifyToken);
  router.post("/auth/login", loginUser);
  router.get("/auth/logout", logoutUser);
  router.post("/auth/register", registerUser);
};
