/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateProductsUseCase } from "../createProduct/CreateProductsUseCase";
import { FindProductByIdUseCase } from "./FindProductByIdUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let findProductByIdUseCase: FindProductByIdUseCase;

describe("Find Product by ID UseCase", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory
        );
        findProductByIdUseCase = new FindProductByIdUseCase(
            productsRepositoryInMemory
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to find a product by ID", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);

        const findProduct = await findProductByIdUseCase.execute(
            createProduct.id
        );

        expect(findProduct).toHaveProperty("id");
    });
    it("should not be able to find a product with ID invalid", async () => {
        const fakeID = faker.datatype.uuid();

        await expect(findProductByIdUseCase.execute(fakeID)).rejects.toEqual(
            new AppError("Product not found", 404)
        );
    });
});
