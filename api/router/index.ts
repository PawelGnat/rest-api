import express from "express";

import users from "./users";
import clients from "./clients";
import auth from "./auth";
import main from "./main";

const router = express.Router();

export default (): express.Router => {
  main(router);
  auth(router);
  users(router);
  clients(router);

  return router;
};
