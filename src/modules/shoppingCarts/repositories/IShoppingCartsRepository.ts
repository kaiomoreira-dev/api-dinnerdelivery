import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";

import { ICreateShoppingCartsDTO } from "../dtos/ICreateShoppingCartsDTO";
import { ShoppingCarts } from "../infra/typeorm/entities/ShoppingCarts";

export interface IShoppingCartsRepository {
  create(data: ICreateShoppingCartsDTO): Promise<ShoppingCarts>;
  list(): Promise<ShoppingCarts[]>;
  findById(id: string): Promise<ShoppingCarts>;
  updateById(id: string, subtotal?: number): Promise<void>;
}
