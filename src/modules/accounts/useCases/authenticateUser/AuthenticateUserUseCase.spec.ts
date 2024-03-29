/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import { redisClient } from "@config/redisClient";
import "dotenv/config";
import { faker } from "@faker-js/faker";
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { RefreshTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/RefreshTokensRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let dayjsDateProvider: DayjsDateProvider;
let refreshTokensRepositoryInMemory: RefreshTokensRepositoryInMemory;

describe("Authenticate User UseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        dayjsDateProvider = new DayjsDateProvider();
        refreshTokensRepositoryInMemory = new RefreshTokensRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            refreshTokensRepositoryInMemory,
            dayjsDateProvider
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should be able to authenticate user", async () => {
        const user: ICreateUserDTO = {
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
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        // Create a user
        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: "fake@email.com",
                password: user.password,
            })
        ).rejects.toEqual(new AppError("Email or password incorrect", 401));
    });

    it("should be able to authenticate user with email toEqual null", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        // Create a user
        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: null,
                password: user.password,
            })
        ).rejects.toEqual(new AppError("Email or password incorrect", 401));
    });

    it("should be able to authenticate user with password wrong", async () => {
        const user: ICreateUserDTO = {
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
                password:
                    "$2b$08$hR1yxPMop6J2/i82m2iR7./RaUx5cVqAJGoitw4oYM0bUfj89DCfa",
            })
        ).rejects.toEqual(new AppError("Email or password incorrect", 401));
    });

    it("should be able to authenticate user with password toEqual null", async () => {
        const user: ICreateUserDTO = {
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
                password: null,
            })
        ).rejects.toEqual(new AppError("Email or password incorrect", 401));
    });
});
