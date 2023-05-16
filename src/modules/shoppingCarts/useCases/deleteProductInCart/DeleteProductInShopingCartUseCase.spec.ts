import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { CreateProductsUseCase } from "@modules/products/useCases/createProduct/CreateProductsUseCase";
import { ProductsShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ProductsShoppingCartsRepositoryInMemory";
import { ShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ShoppingCartsRepositoryInMemory";
import { DeleteProductInShopingCartUseCase } from "@modules/shoppingCarts/useCases/deleteProductInCart/DeleteProductInShopingCartUseCase";

import { AppError } from "@shared/errors/AppError";

import { CreateProductsShoppingCartsUseCase } from "../addProductInCart/CreateProductsShoppingCartsUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let shoppingCartsRepositoryInMemory: ShoppingCartsRepositoryInMemory;
let productsShoppingCartsRepositoryInMemory: ProductsShoppingCartsRepositoryInMemory;
let createProductsShoppingCartsUseCase: CreateProductsShoppingCartsUseCase;
let deleteProductInShopingCartUseCase: DeleteProductInShopingCartUseCase;

describe("Delete product in cart UseCase", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory
        );
        shoppingCartsRepositoryInMemory = new ShoppingCartsRepositoryInMemory();
        productsShoppingCartsRepositoryInMemory =
            new ProductsShoppingCartsRepositoryInMemory(
                productsRepositoryInMemory,
                shoppingCartsRepositoryInMemory
            );
        createProductsShoppingCartsUseCase =
            new CreateProductsShoppingCartsUseCase(
                productsShoppingCartsRepositoryInMemory,
                productsRepositoryInMemory,
                shoppingCartsRepositoryInMemory
            );
        deleteProductInShopingCartUseCase =
            new DeleteProductInShopingCartUseCase(
                productsShoppingCartsRepositoryInMemory,
                shoppingCartsRepositoryInMemory,
                productsRepositoryInMemory
            );
    });

    it("should be able to delete a product in shoppingCart", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(product);

        const addProductInCart =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                quantity: 5,
            });

        const deleteProductInShopingCart =
            await deleteProductInShopingCartUseCase.execute({
                id_products: createdProduct.id,
                id_shoppingCarts: addProductInCart.shoppingCart.id,
            });
        // console.log(JSON.stringify(addProductInCart, null, 2));

        expect(deleteProductInShopingCart).toBe(true);
    });
    it("should not be able to delete a product in shoppingCart with id_products invalid", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(product);

        const addProductInCart =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                quantity: 5,
            });

        await expect(
            deleteProductInShopingCartUseCase.execute({
                id_products: faker.datatype.uuid(),
                id_shoppingCarts: addProductInCart.shoppingCart.id,
            })
        ).rejects.toEqual(new AppError("Product not found", 404));
    });

    it("should be able to delete a product in shoppingCart with id_shoppingCarts invalid", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(product);

        const addProductInCart =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                quantity: 5,
            });

        await expect(
            deleteProductInShopingCartUseCase.execute({
                id_products: createdProduct.id,
                id_shoppingCarts: faker.datatype.uuid(),
            })
        ).rejects.toEqual(new AppError("ShoppingCart ID is not valid", 401));
    });
});
