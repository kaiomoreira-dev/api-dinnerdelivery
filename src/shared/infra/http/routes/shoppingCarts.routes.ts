import { CreateProductsShoppingCartsController } from "@modules/shoppingCarts/useCases/addProductInCart/CreateProductsShoppingCartsController";
import { FindShoppingCartByIdController } from "@modules/shoppingCarts/useCases/findShoppingCartById/FindShoppingCartByIdController";
import { Router } from "express";

export const shoppingCartRoutes = Router();

const createProductsShoppingCartsController =
  new CreateProductsShoppingCartsController();

const findShoppingCartByIdController = new FindShoppingCartByIdController();

shoppingCartRoutes.post(
  "/add-product/:idProducts/:quantity/:idShoppingCarts?",
  createProductsShoppingCartsController.handle
);

shoppingCartRoutes.get("/:id", findShoppingCartByIdController.handle);
