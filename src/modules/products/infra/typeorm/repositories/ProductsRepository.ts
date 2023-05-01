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
    }: ICreateProductsDTO): Promise<Products> {
        const product = this.repository.create({
            id,
            name,
            description,
            quantity,
            unit_price,
        });

        await this.repository.save(product);

        return product;
    }
    async list(): Promise<Products[]> {
        return this.repository.find();
    }
    async findById(id: string): Promise<Products> {
        return this.repository.findOneBy({ id });
    }
    async findByName(name: string): Promise<Products> {
        return this.repository.findOneBy({ name });
    }
    async updateById(
        id: string,
        name?: string,
        description?: string,
        quantity?: number,
        unit_price?: number
    ): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ name, description, quantity, unit_price })
            .where("id = :id", { id })
            .execute();
    }
    async deleteById(id: string): Promise<void> {
        await this.repository.delete({ id });
    }
}
