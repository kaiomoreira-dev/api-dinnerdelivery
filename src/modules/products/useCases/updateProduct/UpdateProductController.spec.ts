import "dotenv/config";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import request from "supertest";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Update Product Controller", () => {
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

    it("should be able to update a product", async () => {
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

        const { id: createdProdutID } = createProduct.body;

        const updateProduct = await request(app)
            .put(`/api/products/${createdProdutID}`)
            .send({
                name: "Laranja lima",
                description: "colhidase lavadas na ultima safras",
                quantity: 10,
                unit_price: 5.55,
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(204);
    });

    it("should be able to update a product with ID in does not exist", async () => {
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

        const fakerID = faker.datatype.uuid();
        const updateProduct = await request(app)
            .put(`/api/products/${fakerID}`)
            .send({
                name: "Uva preta",
                description: "colhidase lavadas na ultima safras",
                quantity: 10,
                unit_price: 5.55,
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(404);
    });

    it("should not be able to update product with quantity less than equal to zero", async () => {
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

        const { id: createdProdutID } = createProduct.body;

        const updateProduct = await request(app)
            .put(`/api/products/${createdProdutID}`)
            .send({
                name: "Laranja lima",
                description: "colhidase lavadas na ultima safras",
                quantity: -1,
                unit_price: 5.55,
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(401);
    });

    it("should not be able to update product with unit_prece less than equal to zero", async () => {
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

        const { id: createdProdutID } = createProduct.body;

        const updateProduct = await request(app)
            .put(`/api/products/${createdProdutID}`)
            .send({
                name: "Laranja lima",
                description: "colhidase lavadas na ultima safras",
                quantity: 12,
                unit_price: 0,
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(401);
    });
});
