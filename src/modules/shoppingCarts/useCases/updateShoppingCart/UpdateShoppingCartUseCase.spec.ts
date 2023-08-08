import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { CreateProductsUseCase } from "@modules/products/useCases/createProduct/CreateProductsUseCase";
import { ProductsShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ProductsShoppingCartsRepositoryInMemory";
import { ShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ShoppingCartsRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateProductsShoppingCartsUseCase } from "../addProductInCart/CreateProductsShoppingCartsUseCase";
import { UpdateShoppingCartUseCase } from "./UpdateShoppingCartUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let shoppingCartsRepositoryInMemory: ShoppingCartsRepositoryInMemory;
let productsShoppingCartsRepositoryInMemory: ProductsShoppingCartsRepositoryInMemory;
let createProductsShoppingCartsUseCase: CreateProductsShoppingCartsUseCase;
let updateShoppingCartUseCase: UpdateShoppingCartUseCase;

describe("Update product in cart UseCase", () => {
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

        updateShoppingCartUseCase = new UpdateShoppingCartUseCase(
            productsShoppingCartsRepositoryInMemory,
            shoppingCartsRepositoryInMemory,
            productsRepositoryInMemory
        );
    });

    it("should be able to update a product in shoppingCart for any user anonymous", async () => {
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

        const quantity = 11;

        const updateProductInCart = await updateShoppingCartUseCase.execute({
            id_products: createdProduct.id,
            quantity,
            id_shoppingCarts: addProductInCart.shoppingCart.id,
        });

        // console.log(JSON.stringify(updateProductInCart, null, 2));

        expect(updateProductInCart).toBe(true);
    });

    it("should be able to update a product in shoppingCart for any user anonymous with quantiy to equal zero", async () => {
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

        const quantity = 0;

        const updateProductInCart = await updateShoppingCartUseCase.execute({
            id_products: createdProduct.id,
            quantity,
            id_shoppingCarts: addProductInCart.shoppingCart.id,
        });

        expect(updateProductInCart).toBe(true);
    });

    it("should be able to update a product in shoppingCart for any user anonymous with quantiy to equal zero with exist more products", async () => {
        const product1: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };
        const product2: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct1 = await createProductsUseCase.execute(product1);
        const createdProduct2 = await createProductsUseCase.execute(product2);

        const addProductInCart1 =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct1.id,
                quantity: 5,
            });

        const addProductInCart2 =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct2.id,
                quantity: 5,
                id_shoppingCarts: addProductInCart1.shoppingCart.id,
            });

        const quantity = 0;

        const updateProductInCart = await updateShoppingCartUseCase.execute({
            id_products: createdProduct2.id,
            quantity,
            id_shoppingCarts: addProductInCart2.shoppingCart.id,
        });

        expect(updateProductInCart).toBe(true);
    });

    it("should not be able to update a product in shoppingCart for any user anonymous with quantity less than zero", async () => {
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

        const quantity = -1;

        await expect(
            updateShoppingCartUseCase.execute({
                id_products: createdProduct.id,
                quantity,
                id_shoppingCarts: addProductInCart.shoppingCart.id,
            })
        ).rejects.toEqual(new AppError("Quantity is not valid", 401));
    });

    it("should not be able to add a update product in shoppingCart for any user anonymous with products ID not exist", async () => {
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

        const quantity = 11;

        const fakeID = faker.datatype.uuid();

        await expect(
            updateShoppingCartUseCase.execute({
                id_products: fakeID,
                quantity,
                id_shoppingCarts: addProductInCart.shoppingCart.id,
            })
        ).rejects.toEqual(new AppError("Product is not found", 404));
    });

    it("should not be able to add a update product in shoppingCart for any user anonymous with shoppingCart ID not exist", async () => {
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

        const quantity = 11;

        const fakeID = faker.datatype.uuid();

        await expect(
            updateShoppingCartUseCase.execute({
                id_products: createdProduct.id,
                quantity,
                id_shoppingCarts: fakeID,
            })
        ).rejects.toEqual(new AppError("ShoppingCart ID is not valid", 401));
    });
});
