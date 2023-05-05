import { CreateProductsController } from "@modules/products/useCases/createProduct/CreateProductsController";
import { ListProductsController } from "@modules/products/useCases/listProduct/ListProductsController";
import { Router } from "express";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

export const productRoutes = Router();

const createProductsController = new CreateProductsController();

const listProductsController = new ListProductsController();

productRoutes.post(
  "/",
  ensureAuthenticate,
  ensureAdmin,
  createProductsController.handle
);

productRoutes.get("/", listProductsController.handle);
