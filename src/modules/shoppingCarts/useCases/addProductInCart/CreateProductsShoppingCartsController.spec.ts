import "dotenv/config";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import request from "supertest";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Add product in cart Controller", () => {
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

    it("should be able to add a product not exist in shopping cart anonymous", async () => {
        const authenticateUser = await request(app).post("/sessions").send({
            email: "useradmin@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const createProduct = await request(app)
            .post("/products")
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
            .post(`/shoppingCart/add-product/${id}/${quantity}/`)
            .send();

        expect(addProductInCart.status).toBe(200);
    });

    it("should be able to update a product already exist in shopping cart anonymous", async () => {
        const authenticateUser = await request(app).post("/sessions").send({
            email: "useradmin@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const createProduct = await request(app)
            .post("/products")
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
            .post(`/shoppingCart/add-product/${id}/${quantity}/`)
            .send();

        const { id: cartId } = addProductInCart.body.shoppingCart;

        const updateProductInCart = await request(app)
            .post(`/shoppingCart/add-product/${id}/${quantity}/${cartId}`)
            .send();

        expect(updateProductInCart.status).toBe(200);
    });

    it("should be able to update a product already exist in shopping cart with shoppingCart ID invalid anonymous", async () => {
        const authenticateUser = await request(app).post("/sessions").send({
            email: "useradmin@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const createProduct = await request(app)
            .post("/products")
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
            .post(`/shoppingCart/add-product/${id}/${quantity}/`)
            .send();

        const cartId = faker.datatype.uuid();

        const updateProductInCart = await request(app)
            .post(`/shoppingCart/add-product/${id}/${quantity}/${cartId}`)
            .send();

        expect(updateProductInCart.status).toBe(401);
    });

    it("should not be able to add a product to cart with invalid quantity", async () => {
        const authenticateUser = await request(app).post("/sessions").send({
            email: "useradmin@test.com",
            password: "userTest@!",
        });

        const { token } = authenticateUser.body;

        const createProduct = await request(app)
            .post("/products")
            .send({
                id: faker.datatype.uuid(),
                name: faker.name.fullName(),
                description: faker.commerce.productDescription(),
                quantity: Number(faker.random.numeric()),
                unit_price: Number(faker.commerce.price()),
            })
            .set({ Authorization: `Bearer ${token}` });

        const { id } = createProduct.body;

        const quantity = 0;

        const addProductInCart = await request(app)
            .post(`/shoppingCart/add-product/${id}/${quantity}/`)
            .send();

        expect(addProductInCart.status).toBe(401);
    });

    it("should not be able to add a product to cart with id product invalid", async () => {
        const id = faker.datatype.uuid();
        const quantity = 5;

        const addProductInCart = await request(app)
            .post(`/shoppingCart/add-product/${id}/${quantity}/`)
            .send();

        expect(addProductInCart.status).toBe(404);
    });
});
