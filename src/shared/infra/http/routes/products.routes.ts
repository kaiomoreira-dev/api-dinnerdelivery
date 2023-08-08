import uploadConfig from "@config/uploadConfig";
import { CreateProductsController } from "@modules/products/useCases/createProduct/CreateProductsController";
import { CreateProductImageController } from "@modules/products/useCases/createProductImage/CreateProductImageController";
import { DeleteProductController } from "@modules/products/useCases/deleteProduct/DeleteProductController";
import { FindProductByIdController } from "@modules/products/useCases/findProductById/FindProductByIdController";
import { ListProductsController } from "@modules/products/useCases/listProduct/ListProductsController";
import { UpdateProductController } from "@modules/products/useCases/updateProduct/UpdateProductController";
import { Router } from "express";
import multer from "multer";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticate } from "../middlewares/ensureAuthenticate";

export const productRoutes = Router();

const createProductsController = new CreateProductsController();

const listProductsController = new ListProductsController();

const findProductByIdController = new FindProductByIdController();

const updateProductController = new UpdateProductController();

const deleteProductController = new DeleteProductController();

const createProductImageController = new CreateProductImageController();

const uploadProduct = multer(uploadConfig);

productRoutes.post(
  "/",
  ensureAuthenticate,
  ensureAdmin,
  createProductsController.handle
);

productRoutes.get("/", listProductsController.handle);

productRoutes.get(
  "/:id",
  ensureAuthenticate,
  ensureAdmin,
  findProductByIdController.handle
);

productRoutes.put(
  "/:id",
  ensureAuthenticate,
  ensureAdmin,
  updateProductController.handle
);

productRoutes.patch(
  "/import/:id",
  ensureAuthenticate,
  ensureAdmin,
  uploadProduct.single("image"),
  createProductImageController.handle
);

productRoutes.delete(
  "/:id",
  ensureAuthenticate,
  ensureAdmin,
  deleteProductController.handle
);
