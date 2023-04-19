/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import express from "express";

import "dotenv/config";

import "reflect-metadata";

import "express-async-errors";

const app = express();

app.use(express.json());

app.listen(3200, () => {
  console.log("Server listening on port 3200");
});
