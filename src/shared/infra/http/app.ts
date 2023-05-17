/* eslint-disable import-helpers/order-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import express, { NextFunction, Request, Response } from "express";

import "dotenv/config";

import "reflect-metadata";

import "express-async-errors";

import "@shared/container";

import { AppError } from "@shared/errors/AppError";

import cors from "cors";

import uploadConfig from "@config/uploadConfig";
import { router } from "./routes";
import rateLimiter from "./middlewares/rateLImiter";

export const app = express();

// const ensureRateLimiter =
//   process.env.NODE_ENV !== "test" ? app.use(rateLimiter) : null;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use("/products", express.static(`${uploadConfig.tmpFolder}/products`));

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      status: "error",
      message: `Internal server - error: ${err.message}`,
    });
  }
);
