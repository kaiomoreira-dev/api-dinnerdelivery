import { ICreateShoppingCartsDTO } from "@modules/shoppingCarts/dtos/ICreateShoppingCartsDTO";
import { ShoppingCarts } from "@modules/shoppingCarts/infra/typeorm/entities/ShoppingCarts";

import { IShoppingCartsRepository } from "../IShoppingCartsRepository";

export class ShoppingCartsRepositoryInMemory
  implements IShoppingCartsRepository
{
  repository: ShoppingCarts[] = [];

  async create({
    id,
    id_users,
    products,
    subtotal,
  }: ICreateShoppingCartsDTO): Promise<ShoppingCarts> {
    const shoppingCarts = new ShoppingCarts();

    Object.assign(shoppingCarts, {
      id,
      id_users,
      products,
      subtotal,
    });
    this.repository.push(shoppingCarts);

    return shoppingCarts;
  }
  async list(): Promise<ShoppingCarts[]> {
    return this.repository;
  }

  async findById(id: string): Promise<ShoppingCarts> {
    return this.repository.find((shoppingCart) => shoppingCart.id === id);
  }

  async updateById(id: string, subtotal?: number): Promise<void> {
    const shoppingCartIndex = this.repository.findIndex(
      (shoppingCart) => shoppingCart.id === id
    );
    this.repository[shoppingCartIndex].subtotal = subtotal;
  }
}
