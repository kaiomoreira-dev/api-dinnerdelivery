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
            .post("/users")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(10),
                address: faker.address.streetAddress(),
            });

        expect(createUser.status).toBe(201);
    });
});
