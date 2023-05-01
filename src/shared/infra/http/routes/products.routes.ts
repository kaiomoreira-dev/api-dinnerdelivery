import { CreateProductsController } from "@modules/products/useCases/createProduct/CreateProductsController";
import { Router } from "express";

import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

export const productRoutes = Router();

const createProductsController = new CreateProductsController();

productRoutes.post("/", ensureAuthenticate, createProductsController.handle);
