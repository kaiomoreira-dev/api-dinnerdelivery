/* eslint-disable import/no-extraneous-dependencies */
import { RefreshTokensRepository } from "@modules/accounts/infra/typeorm/repositories/RefreshTokensRepository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { IRefreshTokensRepository } from "@modules/accounts/repositories/IRefreshTokensRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import "./providers";
import { ProductsRepository } from "@modules/products/infra/typeorm/repositories/ProductsRepository";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ProductsShoppingCartsRepository } from "@modules/shoppingCarts/infra/typeorm/repositories/ProductsShoppingCartsRepository";
import { ShoppingCartsRepository } from "@modules/shoppingCarts/infra/typeorm/repositories/ShoppingCartsRepository";
import { IShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IShoppingCartsRepository";
import { IProductsShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IProductsShoppingCartsRepository";
import { container } from "tsyringe";

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
  ProductsShoppingCartsRepository
);
