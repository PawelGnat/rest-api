import express from "express";

import users from "./users";
import clients from "./clients";
import auth from "./auth";
import main from "./main";
import cron from "./cron";

const router = express.Router();

export default (): express.Router => {
  main(router);
  auth(router);
  users(router);
  clients(router);
  cron(router);

  return router;
};
