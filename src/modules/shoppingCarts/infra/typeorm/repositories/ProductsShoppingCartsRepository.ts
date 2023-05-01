import { ICreateProductsShoppingCartsDTO } from "@modules/shoppingCarts/dtos/ICreateProductsShoppingCartsDTO";
import { IProductsShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IProductsShoppingCartsRepository";
import { Repository } from "typeorm";

import dataSource from "@shared/infra/typeorm";

import { ProductsShoppingCarts } from "../entities/ProductsShoppingCarts";

export class ProductsShoppingCartsRepository
    implements IProductsShoppingCartsRepository
{
    private repository: Repository<ProductsShoppingCarts>;

    constructor() {
        this.repository = dataSource.getRepository(ProductsShoppingCarts);
    }
    async listProductsInShoppingCart(
        id_shoppingCarts: string
    ): Promise<ProductsShoppingCarts[]> {
        return this.repository
            .createQueryBuilder("productsShoppingCarts")
            .leftJoinAndSelect("productsShoppingCarts.products", "products")
            .where(
                "productsShoppingCarts.id_shoppingCarts = :id_shoppingCarts",
                {
                    id_shoppingCarts,
                }
            )
            .getMany();
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
        id_products,
        id_shoppingCarts,
        quantity,
        unit_price,
    }: ICreateProductsShoppingCartsDTO): Promise<ProductsShoppingCarts> {
        const addProductInCart = await this.repository.create({
            id_products,
            id_shoppingCarts,
            unit_price,
            quantity,
        });

        await this.repository.save(addProductInCart);

        return addProductInCart;
    }

    async updateById(
        id_shoppingCarts: string,
        id_products: string,
        quantity: number
    ): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ quantity })
            .where("id_shoppingCarts = :id_shoppingCarts", { id_shoppingCarts })
            .andWhere("id_products = :id_products", { id_products })
            .execute();
    }
}