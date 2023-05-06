/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import { faker } from "@faker-js/faker";
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { RefreshTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/RefreshTokensRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AuthenticateUserUseCase } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateProductsUseCase } from "./CreateProductsUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let dayjsDateProvider: DayjsDateProvider;
let refreshTokensRepositoryInMemory: RefreshTokensRepositoryInMemory;

describe("Create Product UseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        dayjsDateProvider = new DayjsDateProvider();
        refreshTokensRepositoryInMemory = new RefreshTokensRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            refreshTokensRepositoryInMemory,
            dayjsDateProvider
        );
        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory,
            usersRepositoryInMemory
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to create product", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
            admin: true,
        };

        // Create a user
        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(
            product,
            createdUser.id
        );
        expect(createProduct).toHaveProperty("id");
    });

    it("should not be able to create product with name already exists", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
            admin: true,
        };

        // Create a user
        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: Number(faker.commerce.price()),
        };

        const createProduct = await createProductsUseCase.execute(
            product,
            createdUser.id
        );

        await expect(
            createProductsUseCase.execute(
                {
                    id: faker.datatype.uuid(),
                    name: createProduct.name,
                    description: faker.commerce.productDescription(),
                    quantity: faker.datatype.number(4),
                    unit_price: Number(faker.commerce.price()),
                },
                createdUser.id
            )
        ).rejects.toEqual(new AppError("Product already exists", 401));
    });

    it("should not be able to create product with quantity less than or equal to zero", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
            admin: true,
        };

        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: 0,
            unit_price: Number(faker.commerce.price()),
        };

        await expect(
            createProductsUseCase.execute(product, createdUser.id)
        ).rejects.toEqual(new AppError("Quantity is not valid", 401));
    });

    it("should not be able to create product with unit_price less than or equal to zero ", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
            admin: true,
        };

        // Create a user
        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric(2)),
            unit_price: 0,
        };

        await expect(
            createProductsUseCase.execute(product, createdUser.id)
        ).rejects.toEqual(new AppError("Price unit is not valid", 401));
    });
});
