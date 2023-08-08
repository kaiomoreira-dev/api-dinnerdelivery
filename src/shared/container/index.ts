/* eslint-disable import/no-extraneous-dependencies */
import { RefreshTokensRepository } from "@modules/accounts/infra/typeorm/repositories/RefreshTokensRepository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { IRefreshTokensRepository } from "@modules/accounts/repositories/IRefreshTokensRepository";

import "./providers";
import { ProductsRepository } from "@modules/products/infra/typeorm/repositories/ProductsRepository";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ShoppingCartsRepository } from "@modules/shoppingCarts/infra/typeorm/repositories/ShoppingCartsRepository";
import { IProductsShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IProductsShoppingCartsRepository";
import { IShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IShoppingCartsRepository";
import { container } from "tsyringe";
import "@shared/container/in-memory";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ProductsShoppingCartsrtsRepository } from "@modules/shoppingCarts/infra/typeorm/repositories/ProductsShoppingCartsRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IRefreshTokensRepository>(
  "RefreshTokensRepository",
  RefreshTokensRepository
);

container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  ProductsRepository
);

container.registerSingleton<IShoppingCartsRepository>(
  "ShoppingCartsRepository",
  ShoppingCartsRepository
);

container.registerSingleton<IProductsShoppingCartsRepository>(
  "ProductsShoppingCartsRepository",
  ProductsShoppingCartsrtsRepository
);
