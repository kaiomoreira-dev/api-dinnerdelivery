/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ICreateProductsShoppingCartsDTO } from "@modules/shoppingCarts/dtos/ICreateProductsShoppingCartsDTO";
import { IProductsShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IProductsShoppingCartsRepository";
import { IShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IShoppingCartsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class DeleteProductInShopingCartUseCase {
    constructor(
        @inject("ProductsShoppingCartsRepository")
        private productsShoppingCartsRepository: IProductsShoppingCartsRepository,
        @inject("ShoppingCartsRepository")
        private shoppingCartsRepository: IShoppingCartsRepository,
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute({
        id_products,
        id_shoppingCarts,
    }: ICreateProductsShoppingCartsDTO): Promise<boolean> {
        const productsExists = await this.productsRepository.findById(
            id_products
        );

        if (!productsExists) {
            throw new AppError("Product not found", 404);
        }

        const shoppingCartExist = await this.shoppingCartsRepository.findById(
            id_shoppingCarts
        );
        if (!shoppingCartExist) {
            throw new AppError("ShoppingCart ID is not valid", 401);
        }

        const productInCart =
            await this.productsShoppingCartsRepository.findProductInShoppingCart(
                productsExists.id,
                shoppingCartExist.id
            );

        const subtotalProductDelete =
            productInCart.unit_price * productInCart.quantity;

        const calcSubtotal = subtotalProductDelete - shoppingCartExist.subtotal;

        const subtotal = Math.abs(calcSubtotal);

        await this.shoppingCartsRepository.updateById(
            shoppingCartExist.id,
            subtotal
        );

        const deleteProduct =
            await this.productsShoppingCartsRepository.deleteById(
                productInCart.id
            );

        return deleteProduct;
    }
}
