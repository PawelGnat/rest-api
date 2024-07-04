import express from "express";

import { loginUser, registerUser, verifyToken } from "../controllers/auth";

export default (router: express.Router) => {
  router.post("/auth/verify", verifyToken);
  router.post("/auth/login", loginUser);
  router.post("/auth/register", registerUser);
};
