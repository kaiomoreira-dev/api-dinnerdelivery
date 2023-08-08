/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateProductsUseCase } from "../createProduct/CreateProductsUseCase";
import { UpdateProductUseCase } from "./UpdateProductUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let updateProductsUseCase: UpdateProductUseCase;

describe("Update Product UseCase", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory
        );
        updateProductsUseCase = new UpdateProductUseCase(
            productsRepositoryInMemory
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to update a product", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);

        const productUpdate: ICreateProductsDTO = {
            id: createProduct.id,
            name: "Laranja lima",
            description: "colhidase lavadas na ultima safras",
            quantity: 20,
            unit_price: 1.1,
        };

        const updateProduct = await updateProductsUseCase.execute(
            productUpdate
        );

        expect(updateProduct).toHaveProperty("id");
    });

    it("should not be able to update product with ID that does not exist", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        await createProductsUseCase.execute(product);

        const productUpdate: ICreateProductsDTO = {
            id: faker.datatype.uuid(),
            name: "Laranja lima",
            description: "colhidase lavadas na ultima safras",
            quantity: 20,
            unit_price: 1.1,
        };

        await expect(
            updateProductsUseCase.execute(productUpdate)
        ).rejects.toEqual(new AppError("Product not found", 404));
    });

    it("should not be able to update product with quantity less than equal to zero", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);

        const productUpdate: ICreateProductsDTO = {
            id: createProduct.id,
            name: "Laranja lima",
            description: "colhidase lavadas na ultima safras",
            quantity: -1,
            unit_price: 1.1,
        };

        await expect(
            updateProductsUseCase.execute(productUpdate)
        ).rejects.toEqual(new AppError("Quantity is not valid", 401));
    });

    it("should not be able to update product with unit_prece less than equal to zero", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);

        const productUpdate: ICreateProductsDTO = {
            id: createProduct.id,
            name: "Laranja lima",
            description: "colhidase lavadas na ultima safras",
            quantity: 10,
            unit_price: -1,
        };

        await expect(
            updateProductsUseCase.execute(productUpdate)
        ).rejects.toEqual(new AppError("Price unit is not valid", 401));
    });
});
