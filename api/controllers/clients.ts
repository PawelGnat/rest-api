import express from "express";

import {
  getClients,
  getClientById,
  getClientByName,
  createClient,
  deleteClientById,
  updateClientById,
  settleClientById,
} from "../db/clients";
import { getUserById } from "../db/users";

export const getAllClients = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const clients = await getClients();

    return res.status(200).json(clients);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: "danger" });
  }
};

export const getClient = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const client = await getClientById(id);

    return res.status(200).json(client);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: "danger" });
  }
};

export const createNewClient = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, address, userId } = req.body;

    if (!name || !address) {
      return res
        .status(400)
        .json({ error: "Name and address is required", status: "warning" });
    }

    const existingClient = await getClientByName(name);

    if (existingClient) {
      return res
        .status(400)
        .json({ error: "Client already exists", status: "warning" });
    }

    let existingUser;

    if (userId) {
      existingUser = await getUserById(userId);
    }

    if (userId && !existingUser) {
      return res.status(404).json("User not found");
    }

    const client = await createClient({
      name,
      address,
      settled: false,
      userId: existingUser?._id.toString() || "",
    });

    return res
      .status(200)
      .json({ client, message: "Client created", status: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: "danger" });
  }
};

export const deleteClient = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    await deleteClientById(id);

    return res
      .status(200)
      .json({ message: "Client deleted", status: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: "danger" });
  }
};

export const updateClient = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { name, address, userId } = req.body;

    if (!name || !address) {
      return res
        .status(400)
        .json({ error: "Name and address is required", status: "warning" });
    }

    let existingUser;

    if (userId) {
      existingUser = await getUserById(userId);
    }

    if (userId && !existingUser) {
      return res.status(404).json("User not found");
    }

    const existingClient = await getClientById(id);

    if (!existingClient) {
      return res
        .status(404)
        .json({ error: "Client not found", status: "warning" });
    }

    const client = await updateClientById(id, {
      name,
      address,
      settled: existingClient.settled,
      userId: existingUser?._id.toString() || "",
    });

    return res
      .status(200)
      .json({ client, message: "Client updated", status: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: "danger" });
  }
};

export const settleClient = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { settled } = req.body;

    if (typeof settled !== "boolean") {
      return res.status(400).json({ error: "Settled must be a boolean value" });
    }

    const existingClient = await getClientById(id);

    if (!existingClient) {
      return res
        .status(404)
        .json({ error: "Client not found", status: "warning" });
    }

    const client = await settleClientById(id, settled);

    return res
      .status(200)
      .json({ client, message: "Client updated", status: "success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: "danger" });
  }
};
