import { CreateProductsShoppingCartsController } from "@modules/shoppingCarts/useCases/addProductInCart/CreateProductsShoppingCartsController";
import { DeleteProductInShopingCartController } from "@modules/shoppingCarts/useCases/deleteProductInCart/DeleteProductInShopingCartController";
import { FindShoppingCartByIdController } from "@modules/shoppingCarts/useCases/findShoppingCartById/FindShoppingCartByIdController";
import { UpdateShoppingCartController } from "@modules/shoppingCarts/useCases/updateShoppingCart/UpdateShoppingCartController";
import { Router } from "express";

export const shoppingCartRoutes = Router();

const createProductsShoppingCartsController =
  new CreateProductsShoppingCartsController();

const findShoppingCartByIdController = new FindShoppingCartByIdController();

const updateShoppingCartController = new UpdateShoppingCartController();

const deleteProductInShopingCartController =
  new DeleteProductInShopingCartController();

shoppingCartRoutes.post(
  "/add-product/:idProducts/:quantity/:idShoppingCarts?",
  createProductsShoppingCartsController.handle
);

shoppingCartRoutes.get("/:id", findShoppingCartByIdController.handle);

shoppingCartRoutes.put(
  "/:id_products/:quantity/:id_shoppingCarts",
  updateShoppingCartController.handle
);

shoppingCartRoutes.delete(
  "/:id_products/:id_shoppingCarts",
  deleteProductInShopingCartController.handle
);
