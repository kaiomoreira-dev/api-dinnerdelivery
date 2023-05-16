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

    it("should be able to authenticate a user", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(10),
            address: faker.address.streetAddress(),
        };
        await request(app).post("/api/users").send(user);

        const authenticateUser = await request(app).post("/api/sessions").send({
            email: user.email,
            password: user.password,
        });

        expect(authenticateUser.status).toBe(200);
    });

    it("should not be able to authenticate a user with a wrong password", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(10),
            address: faker.address.streetAddress(),
        };
        await request(app).post("/api/users").send(user);

        const authenticateUser = await request(app).post("/api/sessions").send({
            email: user.email,
            password: "fakepass",
        });

        expect(authenticateUser.status).toBe(401);
    });

    it("should not be able to authenticate a user with a wrong email", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(10),
            address: faker.address.streetAddress(),
        };
        await request(app).post("/api/users").send(user);

        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "fakeEmail",
            password: user.password,
        });

        expect(authenticateUser.status).toBe(401);
    });
});
