/* eslint-disable no-restricted-syntax */
import { ICreateProductsShoppingCartsDTO } from "@modules/shoppingCarts/dtos/ICreateProductsShoppingCartsDTO";
import { IProductsShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IProductsShoppingCartsRepository";
import { Repository } from "typeorm";

import dataSource from "@shared/infra/typeorm";

import { ProductsShoppingCarts } from "../entities/ProductsShoppingCarts";

export class ProductsShoppingCartsrtsRepository
    implements IProductsShoppingCartsRepository
{
    private repository: Repository<ProductsShoppingCarts>;

    constructor() {
        this.repository = dataSource.getRepository(ProductsShoppingCarts);
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete({ id });
    }

    async listProductsInShoppingCart(
        id_shoppingCarts: string
    ): Promise<ProductsShoppingCarts[]> {
        const productsShoppingCarts = await this.repository
            .createQueryBuilder("productsShoppingCarts")
            .leftJoinAndSelect("productsShoppingCarts.products", "products")
            .where(
                "productsShoppingCarts.id_shoppingCarts = :id_shoppingCarts",
                {
                    id_shoppingCarts,
                }
            )
            .getMany();

        for (const product of productsShoppingCarts) {
            product.unit_price = Number(product.unit_price);
        }

        return productsShoppingCarts;
    }
    async findProductInShoppingCart(
        id_products: string,
        id_shoppingCarts: string
    ): Promise<ProductsShoppingCarts> {
        const findProductInShoppingCart = await this.repository
            .createQueryBuilder("productsShoppingCarts")
            .where("productsShoppingCarts.id_products = :id_products", {
                id_products,
            })
            .andWhere(
                "productsShoppingCarts.id_shoppingCarts = :id_shoppingCarts",
                {
                    id_shoppingCarts,
                }
            )
            .getOne();

        return findProductInShoppingCart;
    }
    async create({
        id,
        id_products,
        id_shoppingCarts,
        quantity,
        unit_price,
    }: ICreateProductsShoppingCartsDTO): Promise<ProductsShoppingCarts> {
        const addProductInCart = this.repository.create({
            id,
            id_products,
            id_shoppingCarts,
            unit_price,
            quantity,
        });

        await this.repository.save(addProductInCart);

        return addProductInCart;
    }

    async updateById({
        id_shoppingCarts,
        id_products,
        quantity,
    }: ICreateProductsShoppingCartsDTO): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ quantity })
            .where("id_shoppingCarts = :id_shoppingCarts", { id_shoppingCarts })
            .andWhere("id_products = :id_products", { id_products })
            .execute();
    }
}
