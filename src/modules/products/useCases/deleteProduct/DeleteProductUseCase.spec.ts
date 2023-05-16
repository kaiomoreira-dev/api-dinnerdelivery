/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateProductsUseCase } from "../createProduct/CreateProductsUseCase";
import { DeleteProductUseCase } from "./DeleteProductUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let deleteProductsUseCase: DeleteProductUseCase;

describe("Delete Product UseCase", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory
        );
        deleteProductsUseCase = new DeleteProductUseCase(
            productsRepositoryInMemory
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to delete a product", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);

        const deleteProduct = await deleteProductsUseCase.execute({
            id: createProduct.id,
        });

        expect(deleteProduct).toBe(true);
    });

    it("should be able to delete a product with id invalid", async () => {
        const fakeID = faker.datatype.uuid();

        await expect(
            deleteProductsUseCase.execute({
                id: fakeID,
            })
        ).rejects.toEqual(new AppError("Product not found", 404));
    });
});
