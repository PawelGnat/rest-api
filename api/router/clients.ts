import express from "express";

import {
  getAllClients,
  getClient,
  createNewClient,
  deleteClient,
  updateClient,
  settleClient,
} from "../controllers/clients";

import { authorizeEditClientAccess, isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.get("/clients", getAllClients);
  router.post("/clients", isAuthenticated, createNewClient);
  router.get("/clients/:id", getClient);
  router.delete(
    "/clients/:id",
    isAuthenticated,
    authorizeEditClientAccess,
    deleteClient
  );
  router.patch(
    "/clients/:id",
    isAuthenticated,
    authorizeEditClientAccess,
    updateClient
  );
  router.patch(
    "/clients/:id/settle",
    isAuthenticated,
    authorizeEditClientAccess,
    settleClient
  );
};
