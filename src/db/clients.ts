import { Schema, model } from "mongoose";
import { ClientSchema } from "types";

const ClientSchema = new Schema<ClientSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    settled: { type: Boolean, default: false },
    userId: { type: String, ref: "User" },
  },
  { timestamps: true }
);

export const Client = model<ClientSchema>("Client", ClientSchema);

export const getClients = () => Client.find();
export const getClientById = (id: string) => Client.findById(id);
export const getClientByName = (name: string) => Client.findOne({ name });
export const createClient = (values: ClientSchema) => new Client(values).save();
export const deleteClientById = (id: string) =>
  Client.findOneAndDelete({ _id: id });
export const updateClientById = (id: string, values: ClientSchema) =>
  Client.findByIdAndUpdate({ _id: id }, values, { new: true });
export const settleClientById = (id: string, settled: boolean) =>
  Client.findOneAndUpdate({ _id: id }, { settled }, { new: true });
export const settleAllClients = () => Client.updateMany({ settled: false });
