import "dotenv/config";
import { faker } from "@faker-js/faker";
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import request from "supertest";
import { DataSource } from "typeorm";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Authenticate User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection("localhost");

        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();

        await connection.destroy();
    });

    it("should create a refresh token using the refresh token provided", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(10),
            address: faker.address.streetAddress(),
        };
        await request(app).post("/users").send(user);

        const authenticateUser = await request(app).post("/sessions").send({
            email: user.email,
            password: user.password,
        });
        const { refresh_token } = authenticateUser.body;

        const refreshToken = await request(app).post("/refresh-token").send({
            token: refresh_token,
        });

        expect(refreshToken.status).toBe(200);
    });

    it("should not be able to create a refresh token with refresh token invalid", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(10),
            address: faker.address.streetAddress(),
        };
        await request(app).post("/users").send(user);

        await request(app).post("/sessions").send({
            email: user.email,
            password: user.password,
        });

        const refreshToken = await request(app).post("/refresh-token").send({
            token: "invalidtoken",
        });

        expect(refreshToken.status).toBe(401);
    });
});
