/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import { faker } from "@faker-js/faker";
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Create User UseCase", () => {
    beforeEach(() => {
        userRepositoryInMemory = new UsersRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to create user", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        const createUser = await createUserUseCase.execute(user);

        expect(createUser).toHaveProperty("id");
    });

    it("should not be able to create user with leght name less than 6 characters or equall zero", async () => {
        const user: ICreateUserDTO = {
            name: faker.datatype.string(4),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new AppError("Name is not available", 401)
        );
    });

    it("should not be able to create user if email already exists ", async () => {
        const user1: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        await createUserUseCase.execute(user1);

        const user2: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: user1.email,
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        await expect(createUserUseCase.execute(user2)).rejects.toEqual(
            new AppError("Email already exists", 401)
        );
    });

    it("should not be able to create user with password less than lenght 6 characters", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(4),
            address: faker.address.streetAddress(),
        };

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new AppError("Password low lenght", 401)
        );
    });

    it("should not be able to create a user without address", async () => {
        const user: ICreateUserDTO = {
            name: faker.datatype.string(4),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: "",
        };

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new AppError("Address is required", 401)
        );
    });

    it("should not be able to create a user without email field empty", async () => {
        const user: ICreateUserDTO = {
            name: faker.datatype.string(4),
            email: "",
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        await expect(createUserUseCase.execute(user)).rejects.toEqual(
            new AppError("Email not valid", 401)
        );
    });
});
