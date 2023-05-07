/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ICreateProductsShoppingCartsDTO } from "@modules/shoppingCarts/dtos/ICreateProductsShoppingCartsDTO";
import { IProductsShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IProductsShoppingCartsRepository";
import { IShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IShoppingCartsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class UpdateShoppingCartUseCase {
    constructor(
        @inject("ProductsShoppingCartsRepository")
        private productsShoppingCartsRepository: IProductsShoppingCartsRepository,
        @inject("ShoppingCartsRepository")
        private shoppingCartsRepository: IShoppingCartsRepository,
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute({
        id_shoppingCarts,
        id_products,
        quantity,
    }: ICreateProductsShoppingCartsDTO): Promise<void> {
        const shoppingCartExist = await this.shoppingCartsRepository.findById(
            id_shoppingCarts
        );
        if (!shoppingCartExist) {
            throw new AppError("ShoppingCart ID is not valid", 401);
        }

        const foundProducts = await this.productsRepository.findById(
            id_products
        );
        if (!foundProducts) {
            throw new AppError("Product is not found", 404);
        }

        const findProductInShoppingCart =
            await this.productsShoppingCartsRepository.findProductInShoppingCart(
                foundProducts.id,
                shoppingCartExist.id
            );

        const subtotal = findProductInShoppingCart.unit_price * quantity;

        await this.shoppingCartsRepository.updateById(
            shoppingCartExist.id,
            subtotal
        );

        await this.productsShoppingCartsRepository.updateById({
            id_shoppingCarts,
            id_products,
            quantity,
        });
    }
}
