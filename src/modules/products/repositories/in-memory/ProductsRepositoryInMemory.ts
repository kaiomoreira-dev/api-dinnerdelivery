/* eslint-disable import/no-extraneous-dependencies */
import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { Products } from "@modules/products/infra/typeorm/entities/Products";

import { IProductsRepository } from "../IProductsRepository";

export class ProductsRepositoryInMemory implements IProductsRepository {
  repository: Products[] = [];

  async findById(id: string): Promise<Products> {
    return this.repository.find((product) => product.id === id);
  }
  async create({
    name,
    description,
    quantity,
    unit_price,
    product_img,
  }: ICreateProductsDTO): Promise<Products> {
    const product = new Products();

    const generateID = faker.datatype.uuid();

    Object.assign(product, {
      id: generateID,
      name,
      description,
      quantity,
      unit_price,
      product_img,
    });
    this.repository.push(product);

    return product;
  }
  async list(): Promise<Products[]> {
    return this.repository;
  }
  async findByName(name: string): Promise<Products> {
    return this.repository.find((product) => product.name === name);
  }
  async updateById({
    id,
    name,
    description,
    quantity,
    unit_price,
    product_img,
  }: ICreateProductsDTO): Promise<boolean> {
    const productIndex = this.repository.findIndex((pro) => pro.id === id);
    this.repository[productIndex].name = name;
    this.repository[productIndex].description = description;
    this.repository[productIndex].quantity = quantity;
    this.repository[productIndex].unit_price = unit_price;
    this.repository[productIndex].product_img = product_img;

    return true;
  }

  async deleteById(id: string): Promise<boolean> {
    const productIndex = this.repository.findIndex(
      (product) => product.id === id
    );

    this.repository.splice(productIndex, 1);

    return true;
  }
}
