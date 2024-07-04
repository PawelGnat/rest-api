import express from "express";

export default (router: express.Router) => {
  router.get("/", (req, res) => {
    res.send(
      `Server is running, Server is connected with ${
        process.env.ORIGIN_URL || "localhost"
      }:${process.env.ORIGIN_PORT || 3000}`
    );
  });
};
