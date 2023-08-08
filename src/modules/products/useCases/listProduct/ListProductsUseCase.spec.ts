/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";

import { CreateProductsUseCase } from "../createProduct/CreateProductsUseCase";
import { ListProductsUseCase } from "./ListProductsUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let listProductsUseCase: ListProductsUseCase;

describe("List products UseCase", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory
        );
        listProductsUseCase = new ListProductsUseCase(
            productsRepositoryInMemory
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to list all products", async () => {
        const product1: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const product2: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        await createProductsUseCase.execute(product1);
        await createProductsUseCase.execute(product2);

        const listProducts = await listProductsUseCase.execute();

        // console.log(JSON.stringify(listProducts, null, 2));

        expect(listProducts[0]).toHaveProperty("id");
    });
});
