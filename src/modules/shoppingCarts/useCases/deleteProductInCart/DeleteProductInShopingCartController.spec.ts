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

    it("should be able to delete a product in shoppingCart", async () => {
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

        const { id: id_products } = createProduct.body;

        const quantity = 5;

        const addProductInCart = await request(app)
            .post(`/api/shoppingCarts/add-product/${id_products}/${quantity}/`)
            .send();

        const { id: id_shoppingCarts } = addProductInCart.body.shoppingCart;

        // console.log(JSON.stringify(addProductInCart.body, null, 2));

        const deleteProductInCart = await request(app)
            .delete(`/api/shoppingCarts/${id_products}/${id_shoppingCarts}`)
            .send();

        expect(deleteProductInCart.status).toBe(204);
    });

    it("should not be able to delete a product in shoppingCart with id_products invalid", async () => {
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

        const { id: id_products } = createProduct.body;

        const quantity = 5;
        const fakeID = faker.datatype.uuid();

        const addProductInCart = await request(app)
            .post(`/api/shoppingCarts/add-product/${id_products}/${quantity}/`)
            .send();

        const { id: id_shoppingCarts } = addProductInCart.body.shoppingCart;

        const deleteProductInCart = await request(app)
            .delete(`/api/shoppingCarts/${fakeID}/${id_shoppingCarts}`)
            .send();

        expect(deleteProductInCart.status).toBe(404);
    });

    it("should not be able to delete a product in shoppingCart with id_shoppingCarts invalid", async () => {
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

        const { id: id_products } = createProduct.body;

        const quantity = 5;

        const addProductInCart = await request(app)
            .post(`/api/shoppingCarts/add-product/${id_products}/${quantity}/`)
            .send();

        const fakeID = faker.datatype.uuid();

        const deleteProductInCart = await request(app)
            .delete(`/api/shoppingCarts/${id_products}/${fakeID}`)
            .send();

        expect(deleteProductInCart.status).toBe(401);
    });
});
