import "dotenv/config";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import request from "supertest";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "@shared/infra/http/app";
import { createConnection } from "@shared/infra/typeorm";

let connection: DataSource;

describe("Update product in cart by ID Controller", () => {
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

    it("should be able to update a product in shoppingCart for any user anonymous", async () => {
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

        const updateProduct = await request(app)
            .put(
                `/api/shoppingCarts/${id_products}/${quantity}/${id_shoppingCarts}`
            )
            .send()
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(204);
    });

    it("should be able to update a product in shoppingCart for any user anonymous with quantiy to equal zero", async () => {
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

        const updateProduct = await request(app)
            .put(`/api/shoppingCarts/${id_products}/${0}/${id_shoppingCarts}`)
            .send()
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(204);
    });

    it("should be able to update a product in shoppingCart for any user anonymous with quantiy to equal zero with exist more products", async () => {
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

        const addProductInCart1 = await request(app)
            .post(`/api/shoppingCarts/add-product/${id_products}/${quantity}/`)
            .send();

        const { id: id_shoppingCarts1 } = addProductInCart1.body.shoppingCart;

        const addProductInCart2 = await request(app)
            .post(
                `/api/shoppingCarts/add-product/${id_products}/${quantity}/${id_shoppingCarts1}`
            )
            .send();

        const { id: id_shoppingCarts2 } = addProductInCart2.body.shoppingCart;

        const updateProduct = await request(app)
            .put(`/api/shoppingCarts/${id_products}/${0}/${id_shoppingCarts2}`)
            .send()
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(204);
    });

    it("should not be able to update a product in shoppingCart for any user anonymous with quantity less than zero", async () => {
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

        const addProductInCart = await request(app)
            .post(`/api/shoppingCarts/add-product/${id_products}/${5}/`)
            .send();

        const { id: id_shoppingCarts } = addProductInCart.body.shoppingCart;

        const quantity = -1;

        const updateProduct = await request(app)
            .put(
                `/api/shoppingCarts/${id_products}/${quantity}/${id_shoppingCarts}`
            )
            .send()
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(401);
    });

    it("should not be able to add a update product in shoppingCart for any user anonymous with shoppingCart ID not exist", async () => {
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

        const updateProduct = await request(app)
            .put(`/api/shoppingCarts/${id_products}/17/${fakeID}`)
            .send()
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(401);
    });

    it("should not be able to add a update product in shoppingCart for any user anonymous with product ID not exist", async () => {
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

        const fakeID = faker.datatype.uuid();

        const updateProduct = await request(app)
            .put(`/api/shoppingCarts/${fakeID}/17/${id_shoppingCarts}`)
            .send()
            .set({ Authorization: `Bearer ${token}` });

        expect(updateProduct.status).toBe(404);
    });
});
