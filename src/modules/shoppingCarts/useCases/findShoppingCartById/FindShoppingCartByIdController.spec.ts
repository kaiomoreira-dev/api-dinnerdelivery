import "dotenv/config";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import request from "supertest";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Find product in cart by ID Controller", () => {
    beforeAll(async () => {
        connection = await createConnection("localhost");

        await connection.runMigrations();

        const id = uuidv4();
        const email = "useradmin@test.com";
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

    it("should be able to find a product in shoppingCart for any user anonymous", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin@test.com",
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

        const { id } = createProduct.body;

        const quantity = 5;

        const addProductInCart = await request(app)
            .post(`/api/shoppingCarts/add-product/${id}/${quantity}/`)
            .send();

        const { id: id_shoppingCarts } = addProductInCart.body.shoppingCart;

        const findProduct = await request(app)
            .get(`/api/shoppingCarts/${id_shoppingCarts}`)
            .send()
            .set({ Authorization: `Bearer ${token}` });

        expect(findProduct.status).toBe(200);
    });

    it("should not be able to add a find in shoppingCart for any user anonymous with ID not exist", async () => {
        const authenticateUser = await request(app).post("/api/sessions").send({
            email: "useradmin@test.com",
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

        const { id } = createProduct.body;

        const quantity = 5;

        const addProductInCart = await request(app)
            .post(`/api/shoppingCarts/add-product/${id}/${quantity}/`)
            .send();

        const fakeID = faker.datatype.uuid();

        const findProduct = await request(app)
            .get(`/api/shoppingCarts/${fakeID}`)
            .send()
            .set({ Authorization: `Bearer ${token}` });

        expect(findProduct.status).toBe(401);
    });
});
