import express from "express";

import { settleAllClients } from "../db/clients";

export const cronSettleClients = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    await settleAllClients();
    return res.status(200).json("cron runed");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
