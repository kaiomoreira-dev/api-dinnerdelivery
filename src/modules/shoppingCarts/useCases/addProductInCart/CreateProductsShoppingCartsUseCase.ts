/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ICreateProductsShoppingCartsDTO } from "@modules/shoppingCarts/dtos/ICreateProductsShoppingCartsDTO";
import { ProductsShoppingCarts } from "@modules/shoppingCarts/infra/typeorm/entities/ProductsShoppingCarts";
import { ShoppingCarts } from "@modules/shoppingCarts/infra/typeorm/entities/ShoppingCarts";
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

        const foundProducts = await this.productsRepository.findById(
            id_products
        );

        if (!foundProducts) {
            throw new AppError("Product is not found", 404);
        }

        if (quantity <= 0 || !quantity) {
            throw new AppError("Quantity is not valid", 401);
        }

        const subtotal = foundProducts.unit_price * quantity;

        if (id_shoppingCarts) {
            try {
                let shoppingCartExist =
                    await this.shoppingCartsRepository.findById(
                        id_shoppingCarts
                    );

                if (shoppingCartExist) {
                    const productExistInShoppingCart =
                        await this.productsShoppingCartsRepository.findProductInShoppingCart(
                            foundProducts.id,
                            shoppingCartExist.id
                        );

                    shoppingCartExist.subtotal += subtotal;
                    productExistInShoppingCart.quantity += quantity;

                    await this.shoppingCartsRepository.updateById(
                        shoppingCartExist.id,
                        shoppingCartExist.subtotal
                    );

                    await this.productsShoppingCartsRepository.updateById(
                        shoppingCartExist.id,
                        foundProducts.id,
                        productExistInShoppingCart.quantity
                    );

                    listProductsInCart =
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
                        shoppingCart: {
                            id: shoppingCartExist.id,
                            id_users: shoppingCartExist.id_users,
                            subtotal: shoppingCartExist.subtotal,
                            products: itemProduct,
                        },
                    };

                    return cartInfo;
                }
            } catch (error) {
                throw new AppError("ShoppingCart ID is not valid");
            }
        }

        const createShoppingCart = await this.shoppingCartsRepository.create(
            {}
        );

        productInCart = await this.productsShoppingCartsRepository.create({
            id_products: foundProducts.id,
            id_shoppingCarts: createShoppingCart.id,
            quantity,
            unit_price: foundProducts.unit_price,
        });

        createShoppingCart.subtotal += subtotal;

        await this.shoppingCartsRepository.updateById(
            createShoppingCart.id,
            createShoppingCart.subtotal
        );

        listProductsInCart =
            await this.productsShoppingCartsRepository.listProductsInShoppingCart(
                createShoppingCart.id
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
                id: createShoppingCart.id,
                id_users: createShoppingCart.id_users,
                subtotal: createShoppingCart.subtotal,
                products: itemProduct,
            },
        };

        return cartInfo;
    }
}
