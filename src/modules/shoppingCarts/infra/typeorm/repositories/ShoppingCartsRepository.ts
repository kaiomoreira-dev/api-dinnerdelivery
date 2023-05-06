import { ICreateProductsShoppingCartsDTO } from "@modules/shoppingCarts/dtos/ICreateProductsShoppingCartsDTO";
import { IShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IShoppingCartsRepository";
import { Repository } from "typeorm";

import dataSource from "@shared/infra/typeorm";

import { ShoppingCarts } from "../entities/ShoppingCarts";

export class ShoppingCartsRepository implements IShoppingCartsRepository {
    private repository: Repository<ShoppingCarts>;

    constructor() {
        this.repository = dataSource.getRepository(ShoppingCarts);
    }

    async create({
        id,
        id_users,
        products,
        subtotal,
    }: ICreateProductsShoppingCartsDTO): Promise<ShoppingCarts> {
        const shoppingCart = this.repository.create({
            id,
            id_users,
            products,
            subtotal,
        });

        await this.repository.save(shoppingCart);

        return shoppingCart;
    }

    async list(): Promise<ShoppingCarts[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<ShoppingCarts> {
        return this.repository.findOne({
            where: { id },
            relations: { products: true },
        });
    }

    async updateById(id: string, subtotal?: number): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ subtotal })
            .where("id = :id", { id })
            .execute();
    }
}
