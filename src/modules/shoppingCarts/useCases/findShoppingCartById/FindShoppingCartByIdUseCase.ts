/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IProductsShoppingCartsRepository";
import { IShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IShoppingCartsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

interface IResponse {
    id: string;
    id_users: string;
    subtotal: number;
    products: Products[];
}

@injectable()
export class FindShoppingCartByIdUseCase {
    constructor(
        @inject("ProductsShoppingCartsRepository")
        private productsShoppingCartsRepository: IProductsShoppingCartsRepository,
        @inject("ShoppingCartsRepository")
        private shoppingCartsRepository: IShoppingCartsRepository
    ) {}

    async execute(id_shoppingCarts: string): Promise<IResponse> {
        let itemProduct: Products[] = [];
        let cartInfo: IResponse;

        const shoppingCartExist = await this.shoppingCartsRepository.findById(
            id_shoppingCarts
        );

        if (!shoppingCartExist) {
            throw new AppError("ShoppingCart ID is not valid", 401);
        }

        const listProductsInCart =
            await this.productsShoppingCartsRepository.listProductsInShoppingCart(
                shoppingCartExist.id
            );

        for (let productInCart of listProductsInCart) {
            itemProduct.push({
                id: productInCart.products.id,
                name: productInCart.products.name,
                description: productInCart.products.description,
                unit_price: productInCart.unit_price,
                quantity: productInCart.quantity,
            });
        }

        cartInfo = {
            id: shoppingCartExist.id,
            id_users: shoppingCartExist.id_users,
            subtotal: shoppingCartExist.subtotal,
            products: itemProduct,
        };

        return cartInfo;
    }
}
