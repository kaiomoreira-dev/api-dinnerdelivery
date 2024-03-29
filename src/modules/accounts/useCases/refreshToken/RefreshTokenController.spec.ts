import "dotenv/config";
import { faker } from "@faker-js/faker";
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import request from "supertest";
import { DataSource } from "typeorm";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Refresh token Controller", () => {
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
        await request(app).post("/api/users").send(user);

        const authenticateUser = await request(app).post("/api/sessions").send({
            email: user.email,
            password: user.password,
        });
        const { refresh_token } = authenticateUser.body;

        const refreshToken = await request(app)
            .post("/api/refresh-token")
            .send({
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
        await request(app).post("/api/users").send(user);

        await request(app).post("/api/sessions").send({
            email: user.email,
            password: user.password,
        });

        const refreshToken = await request(app)
            .post("/api/refresh-token")
            .send({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJlbWFpbEB0ZXN0ZS5jb20iLCJpYXQiOjE2ODUwNjA2NTksImV4cCI6MTY4NTY2NTQ1OSwic3ViIjoiNjFkMGU1N2ItOTYxZC00ZDY5LTk5MTAtZjZlMGUxNTI0YzcyIn0.thUukeDwSnKkEUuO-WaD2SH4gwqhy0s4_B0rLlEIbro",
            });
        console.log(refreshToken.error);
        expect(refreshToken.status).toBe(404);
    });
});
