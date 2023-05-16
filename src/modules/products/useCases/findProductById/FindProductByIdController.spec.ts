import "dotenv/config";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import request from "supertest";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Find Product by ID Controller", () => {
    beforeAll(async () => {
        connection = await createConnection("localhost");

        await connection.runMigrations();

        const id = uuidv4();
        const email = "useradmin7@test.com";
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

    it("should be able to find a product by ID", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin7@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const createProduct = await request(app)
            .post("/api/products")
            .send({
                name: faker.name.fullName(),
                description: faker.commerce.productDescription(),
                quantity: Number(faker.random.numeric()),
                unit_price: Number(faker.commerce.price()),
            })
            .set({ Authorization: `Bearer ${token}` });

        const { id } = createProduct.body;

        const findProduct = await request(app)
            .get(`/api/products/${id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(findProduct.status).toBe(200);
    });
    it("should be able to find a product with ID invalid", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin7@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const fakerID = faker.datatype.uuid();

        const findProduct = await request(app)
            .get(`/api/products/${fakerID}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(findProduct.status).toBe(404);
    });
});
