/* eslint-disable import/no-extraneous-dependencies */
import express from "express";

import "dotenv/config";

const app = express();

app.listen(3200, () => {
  console.log("Server listening on port 3200");
});
