import { CreateProductsShoppingCartsController } from "@modules/shoppingCarts/useCases/addProductInCart/CreateProductsShoppingCartsController";
import { Router } from "express";

export const shoppingCartRoutes = Router();

const createProductsShoppingCartsController =
  new CreateProductsShoppingCartsController();

shoppingCartRoutes.post(
  "/add-product/:idProducts/:quantity/:idShoppingCarts?",
  createProductsShoppingCartsController.handle
);
