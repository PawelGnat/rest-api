import express from "express";

export default (router: express.Router) => {
  router.get("/", (req, res) => {
    res.send("Server is running, origin url: " + process.env.ORIGIN_URL);
  });
};
