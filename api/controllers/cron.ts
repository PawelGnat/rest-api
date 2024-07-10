import { settleAllClients } from "../db/clients";

export const cronSettleClients = async () => {
  await settleAllClients();
  // const clients = await getClients();
  // io.emit("clients", clients);
  console.log("cron runed");
};
