import "dotenv/config";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import request from "supertest";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Delete Product Controller", () => {
    beforeAll(async () => {
        connection = await createConnection("localhost");

        await connection.runMigrations();

        const id = uuidv4();
        const email = "useradmin3@test.com";
        const password = await hash("userTest@!", 8);

        const id_user = uuidv4();
        const email_user = "userteste1@teste.com";

        connection.query(
            `
        INSERT INTO users(id, name, password, email, address, "admin", created_at, updated_at)
        values('${id}', 'user test', '${password}', '${email}', 'rua test 66 99999', true, 'now()', 'now()'),
        ('${id_user}', 'user test1', '${password}', '${email_user}', 'rua test 66 99999', false, 'now()', 'now()')
        `
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();

        await connection.destroy();
    });

    it("should be able to delete a product", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin3@test.com",
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

        const { id: id_products } = createProduct.body;

        const deleteProduct = await request(app)
            .delete(`/api/products/${id_products}`)
            .set({ Authorization: `Bearer ${token}` });
        expect(deleteProduct.status).toBe(204);
    });

    it("should not be able to delete a product with id invalid", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin3@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const fakerID = faker.datatype.uuid();

        const deleteProduct = await request(app)
            .delete(`/api/products/${fakerID}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(deleteProduct.status).toBe(404);
    });

    it("should not be able to delete a product with user invalid", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin3@test.com",
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

        const { id: id_products } = createProduct.body;

        const authenticateUser1 = await request(app)
            .post("/api/sessions")
            .send({
                email: "userteste1@teste.com",
                password: "userTest@!",
            });

        const { token: userTokenNotAdmin } = authenticateUser1.body;

        const deleteProduct = await request(app)
            .delete(`/api/products/${id_products}`)
            .set({ Authorization: `Bearer ${userTokenNotAdmin}` });

        expect(deleteProduct.status).toBe(401);
    });
});
