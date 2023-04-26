import { CreateOrderController } from "@modules/accounts/useCases/createOrder/CreateOrderController";
import { Router } from "express";

import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

export const orderRoutes = Router();

const createOrderController = new CreateOrderController();

orderRoutes.post("/", ensureAuthenticate, createOrderController.hundle);
