/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import fs from "fs";
import { resolve } from "path";

import { LocalStorageProvider } from "@shared/container/providers/StorageProvider/implementations/LocalStorageProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateProductsUseCase } from "../createProduct/CreateProductsUseCase";
import { CreateProductImageUseCase } from "./CreateProductImageUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let localStorageProvider: LocalStorageProvider;
let createProductImageUseCase: CreateProductImageUseCase;

describe("Create image Product UseCase", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        localStorageProvider = new LocalStorageProvider();
        createProductImageUseCase = new CreateProductImageUseCase(
            productsRepositoryInMemory,
            localStorageProvider
        );

        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to create a image for product ", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);
        const file = "3956e330a61637cc59ddb086b670f471-sucodetox.jpg";

        await fs.promises.rename(
            resolve(`tmp/products/${file}`),
            // colocar o arquivo no caminho destinado
            resolve(`tmp/${file}`)
        );

        // const deleteStorage = jest.spyOn(localStorageProvider, "delete");

        const createImageProduct = await createProductImageUseCase.execute({
            id: createProduct.id,
            product_img: file,
        });

        expect(createImageProduct).toBe(true);
        // expect(deleteStorage).toHaveBeenCalledWith(file, "products");
    });

    it("should not be able to create a image for product with image invalid ", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);

        await expect(
            createProductImageUseCase.execute({
                id: createProduct.id,
                product_img: null,
            })
        ).rejects.toEqual(new AppError("Image is empty", 401));
    });

    it("should not be able to create a image for product with invalid product ID ", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(product);
        const file = "3956e330a61637cc59ddb086b670f471-sucodetox.jpg";

        const fakerID = faker.datatype.uuid();

        await expect(
            createProductImageUseCase.execute({
                id: fakerID,
                product_img: file,
            })
        ).rejects.toEqual(new AppError("Product not found", 404));
    });

    it("should not be able to create a image for product with id invalid ", async () => {
        const file = "3956e330a61637cc59ddb086b670f471-sucodetox.jpg";

        await expect(
            createProductImageUseCase.execute({
                id: null,
                product_img: file,
            })
        ).rejects.toEqual(new AppError("Product is empty", 401));
    });
});
