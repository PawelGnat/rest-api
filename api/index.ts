import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
// import cron from "node-cron";
import "dotenv/config";
// import { Server } from "socket.io";

import router from "./router";

import { settleAllClients } from "./db/clients";
// import { getUsers } from "./db/users";
// import { cronSettleClients } from "./controllers/cron";

const MONGO_URL = `${process.env.DATABASE_URL}`;
const ORIGIN_URL = `${process.env.ORIGIN_URL}` || "http://localhost:3000";

const app = express();

app.use(
  cors({
    origin: `${ORIGIN_URL}`,
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: `${ORIGIN_URL}`,
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("sendClients", async () => {
//     const clients = await getClients();
//     io.emit("clients", clients);
//   });

//   socket.on("sendUsers", async () => {
//     const users = await getUsers();
//     io.emit("users", users);
//   });
// });

server.listen(8080, () => {
  console.log(`Server is running on port:8080`);
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB - on connect");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB - on open, once");
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

app.use("/", router());

// cron.schedule("* * * * *", async () => {
//   console.log("Running cron job...");
//   await settleAllClients();
// });
