import "dotenv/config";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import request from "supertest";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Create Product Controller", () => {
    beforeAll(async () => {
        connection = await createConnection("localhost");

        await connection.runMigrations();

        const id = uuidv4();
        const email = "useradmin6@test.com";
        const password = await hash("userTest@!", 8);

        connection.query(
            `
        INSERT INTO users(id, name, password, email, address, "admin", created_at, updated_at)
        values('${id}', 'user test', '${password}', '${email}', 'rua test 66 99999', true, 'now()', 'now()')
        `
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();

        await connection.destroy();
    });

    it("should be able to create a product", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin6@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const createProduct = await request(app)
            .post("/api/products")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                description: faker.commerce.productDescription(),
                quantity: Number(faker.random.numeric()),
                unit_price: Number(faker.commerce.price()),
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(createProduct.status).toBe(201);
    });

    it("should not be able to create product with name already exists", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin6@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const createProduct1 = await request(app)
            .post("/api/products")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                description: faker.commerce.productDescription(),
                quantity: Number(faker.random.numeric()),
                unit_price: Number(faker.commerce.price()),
            })
            .set({ Authorization: `Bearer ${token}` });

        const createProduct2 = await request(app)
            .post("/api/products")
            .send({
                id: faker.datatype.uuid(),
                name: createProduct1.body.name,
                description: faker.commerce.productDescription(),
                quantity: Number(faker.random.numeric()),
                unit_price: Number(faker.commerce.price()),
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(createProduct2.status).toBe(401);
    });

    it("should not be able to create product with quantity less than or equal to zero", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin6@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const createProduct = await request(app)
            .post("/api/products")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                description: faker.commerce.productDescription(),
                quantity: 0,
                unit_price: Number(faker.commerce.price()),
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(createProduct.status).toBe(401);
    });

    it("should not be able to create product with unit_price less than or equal to zero", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin6@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const createProduct = await request(app)
            .post("/api/products")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                description: faker.commerce.productDescription(),
                quantity: Number(faker.random.numeric()),
                unit_price: 0,
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(createProduct.status).toBe(401);
    });
});
