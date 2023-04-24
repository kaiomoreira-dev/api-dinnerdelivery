/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import "dotenv/config";
import { faker } from "@faker-js/faker";
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { UserRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User UseCase", () => {
    beforeEach(() => {
        userRepositoryInMemory = new UserRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(
            userRepositoryInMemory
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to authenticate user", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        // Create a user
        await createUserUseCase.execute(user);

        // Authenticate a user
        const authenticateUser = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(authenticateUser).toHaveProperty("token");
    });

    it("should be able to authenticate user with email wrong", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        // Create a user
        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: "wrongEmail",
                password: user.password,
            })
        ).rejects.toEqual(new AppError("Email or password incorrect", 401));
    });

    it("should be able to authenticate user with password wrong", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        // Create a user
        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: user.email,
                password: "passerror",
            })
        ).rejects.toEqual(new AppError("Email or password incorrect", 401));
    });
});
