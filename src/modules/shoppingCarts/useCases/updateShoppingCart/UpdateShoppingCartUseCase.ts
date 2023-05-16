/* eslint-disable consistent-return */
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
    }: ICreateProductsShoppingCartsDTO): Promise<boolean> {
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

        if (quantity < 0) {
            throw new AppError("Quantity is not valid", 401);
        }

        const findProductInShoppingCart =
            await this.productsShoppingCartsRepository.findProductInShoppingCart(
                foundProducts.id,
                shoppingCartExist.id
            );

        const listProductsInCart =
            await this.productsShoppingCartsRepository.listProductsInShoppingCart(
                shoppingCartExist.id
            );

        let calcSubtotal = 0;

        listProductsInCart.forEach((product) => {
            let calcPrice = product.unit_price * product.quantity;

            calcSubtotal += calcPrice;
        });

        if (quantity === 0 && listProductsInCart.length > 1) {
            const priceProductFind =
                findProductInShoppingCart.quantity *
                findProductInShoppingCart.unit_price;

            const subtotal = Math.abs(calcSubtotal - priceProductFind);

            await this.shoppingCartsRepository.updateById(
                shoppingCartExist.id,
                subtotal
            );

            await this.productsShoppingCartsRepository.deleteById(
                findProductInShoppingCart.id
            );

            return true;
        }

        if (quantity === 0 && listProductsInCart.length === 1) {
            await this.productsShoppingCartsRepository.deleteById(
                findProductInShoppingCart.id
            );

            await this.shoppingCartsRepository.deleteById(shoppingCartExist.id);

            return true;
        }

        await this.productsShoppingCartsRepository.updateById({
            id_shoppingCarts,
            id_products,
            quantity,
        });

        const priceProductInCart =
            (quantity - findProductInShoppingCart.quantity) *
            findProductInShoppingCart.unit_price;

        const subtotal = calcSubtotal + priceProductInCart;

        const updateProduct = await this.shoppingCartsRepository.updateById(
            shoppingCartExist.id,
            subtotal
        );

        return updateProduct;
    }
}
