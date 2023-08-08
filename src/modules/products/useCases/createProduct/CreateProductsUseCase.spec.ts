/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateProductsUseCase } from "./CreateProductsUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;

describe("Create Product UseCase", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to create product", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);
        expect(createProduct).toHaveProperty("id");
    });

    it("should not be able to create product with name already exists", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);

        await expect(
            createProductsUseCase.execute({
                id: faker.datatype.uuid(),
                name: createProduct.name,
                description: faker.commerce.productDescription(),
                quantity: faker.datatype.number(4),
                unit_price: Number(faker.commerce.price()),
            })
        ).rejects.toEqual(new AppError("Product already exists", 401));
    });

    it("should not be able to create product with name is empty", async () => {
        await expect(
            createProductsUseCase.execute({
                id: faker.datatype.uuid(),
                name: null,
                description: faker.commerce.productDescription(),
                quantity: faker.datatype.number(4),
                unit_price: Number(faker.commerce.price()),
            })
        ).rejects.toEqual(new AppError("Product name is empty", 401));
    });

    it("should not be able to create product with quantity less than or equal to zero", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: 0,
            unit_price: Number(faker.commerce.price()),
        };

        await expect(createProductsUseCase.execute(product)).rejects.toEqual(
            new AppError("Quantity is not valid", 401)
        );
    });

    it("should not be able to create product with unit_price less than or equal to zero ", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric(2)),
            unit_price: 0,
        };

        await expect(createProductsUseCase.execute(product)).rejects.toEqual(
            new AppError("Price unit is not valid", 401)
        );
    });
});
