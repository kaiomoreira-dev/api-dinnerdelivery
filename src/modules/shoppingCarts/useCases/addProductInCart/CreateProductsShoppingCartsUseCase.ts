/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ICreateProductsShoppingCartsDTO } from "@modules/shoppingCarts/dtos/ICreateProductsShoppingCartsDTO";
import { ProductsShoppingCarts } from "@modules/shoppingCarts/infra/typeorm/entities/ProductsShoppingCarts";
import { IProductsShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IProductsShoppingCartsRepository";
import { IShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IShoppingCartsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

interface IResponse {
    shoppingCart: {
        id: string;
        id_users: string;
        subtotal: number;
        products: Products[];
    };
}

@injectable()
export class CreateProductsShoppingCartsUseCase {
    constructor(
        @inject("ProductsShoppingCartsRepository")
        private productsShoppingCartsRepository: IProductsShoppingCartsRepository,
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,
        @inject("ShoppingCartsRepository")
        private shoppingCartsRepository: IShoppingCartsRepository
    ) {}

    async execute({
        id_products,
        id_shoppingCarts,
        quantity,
    }: ICreateProductsShoppingCartsDTO): Promise<IResponse> {
        let itemProduct: Products[] = [];
        let cartInfo: IResponse;
        let productInCart: ProductsShoppingCarts;
        let listProductsInCart: ProductsShoppingCarts[];

        let shoppingCart = await this.shoppingCartsRepository.findById(
            id_shoppingCarts
        );

        if (!shoppingCart) {
            shoppingCart = await this.shoppingCartsRepository.create({});
        }

        const foundProducts = await this.productsRepository.findById(
            id_products
        );

        if (!foundProducts) {
            throw new AppError("Product is not found", 404);
        }

        const subtotal = foundProducts.unit_price * quantity;
        const productExistInShoppingCart =
            await this.productsShoppingCartsRepository.findProductInShoppingCart(
                foundProducts.id,
                shoppingCart.id
            );

        if (productExistInShoppingCart) {
            shoppingCart.subtotal += subtotal;
            productExistInShoppingCart.quantity += quantity;

            await this.shoppingCartsRepository.updateById(
                shoppingCart.id,
                shoppingCart.subtotal
            );

            await this.productsShoppingCartsRepository.updateById(
                shoppingCart.id,
                foundProducts.id,
                productExistInShoppingCart.quantity
            );

            listProductsInCart =
                await this.productsShoppingCartsRepository.listProductsInShoppingCart(
                    shoppingCart.id
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
                shoppingCart: {
                    id: shoppingCart.id,
                    id_users: shoppingCart.id_users,
                    subtotal: shoppingCart.subtotal,
                    products: itemProduct,
                },
            };

            return cartInfo;
        }

        productInCart = await this.productsShoppingCartsRepository.create({
            id_products: foundProducts.id,
            id_shoppingCarts: shoppingCart.id,
            quantity,
            unit_price: foundProducts.unit_price,
        });

        shoppingCart.subtotal += subtotal;

        await this.shoppingCartsRepository.updateById(
            shoppingCart.id,
            shoppingCart.subtotal
        );

        listProductsInCart =
            await this.productsShoppingCartsRepository.listProductsInShoppingCart(
                shoppingCart.id
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
            shoppingCart: {
                id: shoppingCart.id,
                id_users: shoppingCart.id_users,
                subtotal: shoppingCart.subtotal,
                products: itemProduct,
            },
        };

        return cartInfo;
    }
}
