import express from "express";

import users from "./users";
import clients from "./clients";
import auth from "./auth";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  users(router);
  clients(router);

  return router;
};
