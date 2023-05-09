import { CreateProductsShoppingCartsController } from "@modules/shoppingCarts/useCases/addProductInCart/CreateProductsShoppingCartsController";
import { FindShoppingCartByIdController } from "@modules/shoppingCarts/useCases/findShoppingCartById/FindShoppingCartByIdController";
import { UpdateShoppingCartController } from "@modules/shoppingCarts/useCases/updateShoppingCart/UpdateShoppingCartController";
import { Router } from "express";

export const shoppingCartRoutes = Router();

const createProductsShoppingCartsController =
  new CreateProductsShoppingCartsController();

const findShoppingCartByIdController = new FindShoppingCartByIdController();

const updateShoppingCartController = new UpdateShoppingCartController();

shoppingCartRoutes.post(
  "/add-product/:idProducts/:quantity/:idShoppingCarts?",
  createProductsShoppingCartsController.handle
);

shoppingCartRoutes.get("/:id", findShoppingCartByIdController.handle);

shoppingCartRoutes.put(
  "/:id_products/:quantity/:id_shoppingCarts",
  updateShoppingCartController.handle
);
