/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { faker } from "@faker-js/faker";
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

  async deleteById(id: string): Promise<boolean> {
    const userIndex = this.repository.findIndex((product) => product.id === id);

    this.repository.splice(userIndex, 1);

    return true;
  }

  async create({
    id_products,
    id_shoppingCarts,
    quantity,
    unit_price,
  }: ICreateProductsShoppingCartsDTO): Promise<ProductsShoppingCarts> {
    const productsShoppingCarts = new ProductsShoppingCarts();

    const products: Products[] = [];

    const productsList = await this.listProductsInShoppingCart(
      id_shoppingCarts
    );
    for (const productSoppingCart of productsList) {
      const product = await this.productsRepositoryInMemory.findById(
        id_products
      );

      products.push({
        id: product.id,
        name: product.name,
        description: product.description,
        unit_price: product.unit_price,
        quantity: productSoppingCart.quantity,
      });
    }

    const newProduct = await this.productsRepositoryInMemory.findById(
      id_products
    );

    products.push({
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      unit_price: newProduct.unit_price,
      quantity,
    });

    const generateID = faker.datatype.uuid();

    Object.assign(productsShoppingCarts, {
      id: generateID,
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
            productsShoppingCarts.id_products === products.id
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

  async updateById({
    id,
    id_products,
    id_shoppingCarts,
    quantity,
    unit_price,
  }: ICreateProductsShoppingCartsDTO): Promise<void> {
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
    this.repository[productsShoppingCartsIndex].quantity = unit_price;
  }
}
