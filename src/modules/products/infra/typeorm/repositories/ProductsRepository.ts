/* eslint-disable no-param-reassign */
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { Repository } from "typeorm";

import dataSource from "@shared/infra/typeorm";

import { Products } from "../entities/Products";

export class ProductsRepository implements IProductsRepository {
    private repository: Repository<Products>;

    constructor() {
        this.repository = dataSource.getRepository(Products);
    }

    async create({
        id,
        name,
        description,
        quantity,
        unit_price,
        product_img,
    }: ICreateProductsDTO): Promise<Products> {
        const product = this.repository.create({
            id,
            name,
            description,
            quantity,
            unit_price,
            product_img,
        });

        await this.repository.save(product);

        return product;
    }
    async list(): Promise<Products[]> {
        const products = await this.repository.find({
            order: { updated_at: "DESC" },
        });

        products.forEach((product: Products) => {
            product.unit_price = Number(product.unit_price);
        });

        return products;
    }
    async findById(id: string): Promise<Products> {
        const product = await this.repository.findOneBy({ id }).catch(() => {
            return null;
        });

        if (!product) {
            return null;
        }

        product.unit_price = Number(product.unit_price);

        return product;
    }
    async findByName(name: string): Promise<Products> {
        return this.repository.findOneBy({ name });
    }
    async updateById({
        id,
        name,
        description,
        quantity,
        unit_price,
        product_img,
    }: ICreateProductsDTO): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ name, description, quantity, unit_price, product_img })
            .where("id = :id", { id })
            .execute();
    }
    async deleteById(id: string): Promise<void> {
        await this.repository.delete({ id });
    }
}
