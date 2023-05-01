import { RefreshTokens } from "@modules/accounts/infra/typeorm/entities/RefreshTokens";
import { Users } from "@modules/accounts/infra/typeorm/entities/Users";
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { ProductsShoppingCarts } from "@modules/shoppingCarts/infra/typeorm/entities/ProductsShoppingCarts";
import { ShoppingCarts } from "@modules/shoppingCarts/infra/typeorm/entities/ShoppingCarts";
import { DataSource } from "typeorm";

import { CreateUsers1681917942698 } from "./migrations/1681917942698-CreateUsers";
import { CreateRefreshToken1682435280583 } from "./migrations/1682435280583-CreateRefreshToken";
import { CreateProdutcs1682627046289 } from "./migrations/1682627046289-CreateProdutcs";
import { CreateShoppingCart1682685180882 } from "./migrations/1682685180882-CreateShoppingCart";
import { CreateProductsShoppingCarts1682689664277 } from "./migrations/1682689664277-CreateProductsShoppingCarts";

const dataSource = new DataSource({
  type: "postgres",
  port: 1999,
  username: "docker",
  password: "YWfv44186uG6oBetxJC7sOAxJttd6aLe0zpmb_xdwpQ",
  database:
    process.env.NODE_ENV === "test" ? "dinnerdelivery_test" : "dinnerDelivery",

  // importar entidades ex: [Recipes]
  entities: [
    Users,
    RefreshTokens,
    Products,
    ShoppingCarts,
    ProductsShoppingCarts,
  ],
  // importar migrations ex: [CreateRecipes102348998]
  migrations: [
    CreateUsers1681917942698,
    CreateRefreshToken1682435280583,
    CreateProdutcs1682627046289,
    CreateShoppingCart1682685180882,
    CreateProductsShoppingCarts1682689664277,
  ],
});

export function createConnection(host = "localhost"): Promise<DataSource> {
  return dataSource.setOptions({ host }).initialize();
}

export default dataSource;
