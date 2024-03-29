import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { CreateProductsUseCase } from "@modules/products/useCases/createProduct/CreateProductsUseCase";
import { ProductsShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ProductsShoppingCartsRepositoryInMemory";
import { ShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ShoppingCartsRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateProductsShoppingCartsUseCase } from "./CreateProductsShoppingCartsUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let shoppingCartsRepositoryInMemory: ShoppingCartsRepositoryInMemory;
let productsShoppingCartsRepositoryInMemory: ProductsShoppingCartsRepositoryInMemory;
let createProductsShoppingCartsUseCase: CreateProductsShoppingCartsUseCase;

describe("Add product in cart UseCase", () => {
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
    });

    it("should be able to add a product in shoppingCart for any user anonymous", async () => {
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

        // console.log(JSON.stringify(addProductInCart, null, 2));

        expect(addProductInCart.shoppingCart).toHaveProperty("id");
        expect(addProductInCart.shoppingCart.products[0]).toHaveProperty("id");
    });

    it("should be able to update a product already exist in shopping cart for the same user anonymous", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(product);

        // create produto in cart
        const shoppingCart = await createProductsShoppingCartsUseCase.execute({
            id_products: createdProduct.id,
            quantity: 6,
        });

        // update produto in cart
        const updateProductInCart =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                id_shoppingCarts: shoppingCart.shoppingCart.id,
                quantity: 3,
            });
        expect(updateProductInCart.shoppingCart).toHaveProperty("id");
        expect(updateProductInCart.shoppingCart.products[0]).toHaveProperty(
            "id"
        );
    });

    it("should be able to create a new product in shopping cart already exist with others products for the same user anonymous", async () => {
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
        // create produto in cart
        const createProduct1InCar =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct1.id,
                quantity: 6,
            });

        const createProduct2InCar =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct2.id,
                quantity: 4,
                id_shoppingCarts: createProduct1InCar.shoppingCart.id,
            });

        // console.log(JSON.stringify(createProduct2InCar, null, 2));

        expect(createProduct2InCar.shoppingCart.products.length).toBe(2);
    });

    it("should be able to update a product already exist in shopping cart with shoppingCart ID invalid anonymous", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(product);

        // update produto in cart
        await expect(
            createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                id_shoppingCarts: faker.datatype.uuid(),
                quantity: 5,
            })
        ).rejects.toEqual(new AppError("ShoppingCart ID is not valid", 401));
    });

    it("should not be able to add a product to cart with invalid quantity", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(product);

        const createdCart = await shoppingCartsRepositoryInMemory.create({
            id_users: null,
            subtotal: 0,
            products: [],
        });

        await expect(
            createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                id_shoppingCarts: createdCart.id,
                quantity: 0,
            })
        ).rejects.toEqual(new AppError("Quantity is not valid", 401));
    });

    it("should not be able to add a product to cart with id product invalid", async () => {
        const createdCart = await shoppingCartsRepositoryInMemory.create({
            id_users: null,
            subtotal: 0,
            products: [],
        });

        await expect(
            createProductsShoppingCartsUseCase.execute({
                id_products: faker.datatype.uuid(),
                id_shoppingCarts: createdCart.id,
                quantity: 0,
            })
        ).rejects.toEqual(new AppError("Product is not found", 404));
    });
});
