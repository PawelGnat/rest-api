import express from "express";

import { cronSettleClients } from "../controllers/cron";

export default (router: express.Router) => {
  router.get("/cron", cronSettleClients);
};
