import { redisClient } from "@config/redisClient";
import { faker } from "@faker-js/faker";
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { IRefreshTokensDTO } from "@modules/accounts/dtos/IRefreshTokensDTO";
import { RefreshTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/RefreshTokensRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

let dayjsDateProvider: DayjsDateProvider;
let refreshTokensRepositoryInMemory: RefreshTokensRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let refreshTokenUseCase: RefreshTokenUseCase;

describe("Refresh token UseCase", () => {
    beforeEach(() => {
        dayjsDateProvider = new DayjsDateProvider();
        refreshTokensRepositoryInMemory = new RefreshTokensRepositoryInMemory();
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            refreshTokensRepositoryInMemory,
            dayjsDateProvider
        );
        refreshTokenUseCase = new RefreshTokenUseCase(
            refreshTokensRepositoryInMemory,
            dayjsDateProvider
        );
    });

    afterAll(() => {
        redisClient.quit();
    });

    it("should create a refresh token using the refresh token provided", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        // Create a user
        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        const authenticatedUser = await authenticateUserUseCase.execute({
            email: createdUser.email,
            password: user.password,
        });
        //

        const updatedToken = await refreshTokenUseCase.execute(
            authenticatedUser.refresh_token
        );

        expect(updatedToken).toHaveProperty("refresh_token");
        expect(updatedToken).toHaveProperty("token");
    });
    it("should not be able to create a refresh token with refresh token invalid", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
        };

        // Create a user
        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: createdUser.email,
            password: user.password,
        });
        //

        const fakeToken = ``;

        await expect(refreshTokenUseCase.execute(fakeToken)).rejects.toEqual(
            new AppError("Token not valid", 401)
        );
    });
});
