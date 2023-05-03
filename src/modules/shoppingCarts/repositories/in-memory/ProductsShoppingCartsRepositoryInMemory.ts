/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ICreateProductsShoppingCartsDTO } from "@modules/shoppingCarts/dtos/ICreateProductsShoppingCartsDTO";
import { ProductsShoppingCarts } from "@modules/shoppingCarts/infra/typeorm/entities/ProductsShoppingCarts";
import { inject, injectable } from "tsyringe";

import { IProductsShoppingCartsRepository } from "../IProductsShoppingCartsRepository";
import { IShoppingCartsRepository } from "../IShoppingCartsRepository";

@injectable()
export class ProductsShoppingCartsRepositoryInMemory
  implements IProductsShoppingCartsRepository
{
  repository: ProductsShoppingCarts[] = [];

  constructor(
    @inject("ProductsRepositoryInMemory")
    private productsRepositoryInMemory: IProductsRepository,
    @inject("ShoppingCartsRepositoryInMemory")
    private shoppingCartsRepositoryInMemory: IShoppingCartsRepository
  ) {}

  async create({
    id_products,
    id_shoppingCarts,
    quantity,
    unit_price,
  }: ICreateProductsShoppingCartsDTO): Promise<ProductsShoppingCarts> {
    const productsShoppingCarts = new ProductsShoppingCarts();

    const products: Products[] = [];

    const product = await this.productsRepositoryInMemory.findById(id_products);

    products.push(product);

    Object.assign(productsShoppingCarts, {
      id_products,
      id_shoppingCarts,
      quantity,
      unit_price,
      products,
    });

    this.repository.push(productsShoppingCarts);

    return productsShoppingCarts;
  }

  async listProductsInShoppingCart(
    id_shoppingCarts: string
  ): Promise<ProductsShoppingCarts[]> {
    const shoppingCartExist =
      await this.shoppingCartsRepositoryInMemory.findById(id_shoppingCarts);

    this.repository.map(async (productsShoppingCarts) => {
      if (productsShoppingCarts.id_shoppingCarts === shoppingCartExist.id) {
        const products = await this.productsRepositoryInMemory.findById(
          productsShoppingCarts.id_products
        );

        const productCartIndex = this.repository.findIndex(
          (productsShoppingCarts) =>
            productsShoppingCarts.id_shoppingCarts === shoppingCartExist.id &&
            productsShoppingCarts.id_products
        );

        this.repository[productCartIndex].products = products;
      }
    });

    const listProductsInCart = this.repository.map((productsShoppingCarts) => {
      if (productsShoppingCarts.id_shoppingCarts === shoppingCartExist.id) {
        return productsShoppingCarts;
      }
    });

    return listProductsInCart;
  }

  async findProductInShoppingCart(
    id_products: string,
    id_shoppingCarts: string
  ): Promise<ProductsShoppingCarts> {
    const productExist = await this.productsRepositoryInMemory.findById(
      id_products
    );
    const shoppingCartExist =
      await this.shoppingCartsRepositoryInMemory.findById(id_shoppingCarts);

    const productsShoppingCarts = this.repository.find(
      (productsShoppingCarts) => {
        if (
          productsShoppingCarts.id_shoppingCarts === shoppingCartExist.id &&
          productsShoppingCarts.id_products === productExist.id
        )
          return productsShoppingCarts;
      }
    );

    return productsShoppingCarts;
  }

  async updateById(
    id_shoppingCarts: string,
    id_products: string,
    quantity: number
  ): Promise<void> {
    const productExist = await this.productsRepositoryInMemory.findById(
      id_products
    );
    const shoppingCartExist =
      await this.shoppingCartsRepositoryInMemory.findById(id_shoppingCarts);

    const productsShoppingCartsIndex = this.repository.findIndex(
      (productsShoppingCarts) => {
        if (
          productsShoppingCarts.id_products === productExist.id &&
          productsShoppingCarts.id_shoppingCarts === shoppingCartExist.id
        )
          return productsShoppingCarts;
      }
    );

    this.repository[productsShoppingCartsIndex].quantity = quantity;
  }
}
