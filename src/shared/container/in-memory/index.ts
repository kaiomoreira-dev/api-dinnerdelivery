import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ShoppingCartsRepositoryInMemory";
import { IShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IShoppingCartsRepository";
import { container } from "tsyringe";

container.registerSingleton<IProductsRepository>(
  "ProductsRepositoryInMemory",
  ProductsRepositoryInMemory
);

container.registerSingleton<IShoppingCartsRepository>(
  "ShoppingCartsRepositoryInMemory",
  ShoppingCartsRepositoryInMemory
);
