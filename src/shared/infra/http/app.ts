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

import { router } from "./routes";

export const app = express();

app.use(express.json());

app.use(router);

app.use(cors());

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
