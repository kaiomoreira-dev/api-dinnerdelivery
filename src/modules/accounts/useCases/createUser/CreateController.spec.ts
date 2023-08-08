import "dotenv/config";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { DataSource } from "typeorm";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Create User Controller", () => {
    beforeAll(async () => {
        connection = await createConnection("localhost");

        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();

        await connection.destroy();
    });

    it("should be able to create a user", async () => {
        const createUser = await request(app)
            .post("/api/users")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(10),
                address: faker.address.streetAddress(),
            });

        expect(createUser.status).toBe(201);
    });

    it("should not be able to create user with leght name less than 6 characters or equall zero", async () => {
        const createUser = await request(app)
            .post("/api/users")
            .send({
                id: faker.datatype.uuid(),
                name: "fake",
                email: faker.internet.email(),
                password: faker.internet.password(10),
                address: faker.address.streetAddress(),
            });

        expect(createUser.status).toBe(401);
    });

    it("should not be able to create user if email already exists", async () => {
        const emailTest = "test@email.com";
        const createUser1 = await request(app)
            .post("/api/users")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                email: emailTest,
                password: faker.internet.password(10),
                address: faker.address.streetAddress(),
            });

        const createUser2 = await request(app)
            .post("/api/users")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                email: emailTest,
                password: faker.internet.password(10),
                address: faker.address.streetAddress(),
            });

        expect(createUser2.status).toBe(401);
    });

    it("should not be able to create user with password less than lenght 6 characters or equall zero", async () => {
        const createUser = await request(app)
            .post("/api/users")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(4),
                address: faker.address.streetAddress(),
            });

        expect(createUser.status).toBe(401);
    });

    it("should not be able to create a user without address", async () => {
        const createUser = await request(app)
            .post("/api/users")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(10),
                address: "",
            });

        expect(createUser.status).toBe(401);
    });

    it("should not be able to create a user without email field empty", async () => {
        const createUser = await request(app)
            .post("/api/users")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                email: "",
                password: faker.internet.password(10),
                address: faker.address.streetAddress(),
            });

        expect(createUser.status).toBe(401);
    });
});
