import { faker } from "@faker-js/faker";
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { RefreshTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/RefreshTokensRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { AuthenticateUserUseCase } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { CreateProductsUseCase } from "@modules/products/useCases/createProduct/CreateProductsUseCase";
import { ProductsShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ProductsShoppingCartsRepositoryInMemory";
import { ShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ShoppingCartsRepositoryInMemory";

import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateProductsShoppingCartsUseCase } from "./CreateProductsShoppingCartsUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let dayjsDateProvider: DayjsDateProvider;
let refreshTokensRepositoryInMemory: RefreshTokensRepositoryInMemory;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let shoppingCartsRepositoryInMemory: ShoppingCartsRepositoryInMemory;
let productsShoppingCartsRepositoryInMemory: ProductsShoppingCartsRepositoryInMemory;
let createProductsShoppingCartsUseCase: CreateProductsShoppingCartsUseCase;

describe("Add product in cart UseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        dayjsDateProvider = new DayjsDateProvider();
        refreshTokensRepositoryInMemory = new RefreshTokensRepositoryInMemory();

        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            refreshTokensRepositoryInMemory,
            dayjsDateProvider
        );
        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory,
            usersRepositoryInMemory
        );
        shoppingCartsRepositoryInMemory = new ShoppingCartsRepositoryInMemory();
        productsShoppingCartsRepositoryInMemory =
            new ProductsShoppingCartsRepositoryInMemory(
                productsRepositoryInMemory,
                shoppingCartsRepositoryInMemory
            );
        createProductsShoppingCartsUseCase =
            new CreateProductsShoppingCartsUseCase(
                productsShoppingCartsRepositoryInMemory,
                productsRepositoryInMemory,
                shoppingCartsRepositoryInMemory
            );
    });

    it("should be able to add a product in shoppingCart anonymous", async () => {
        const user: ICreateUserDTO = {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
            admin: true,
        };

        // Create a userr
        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(
            product,
            createdUser.id
        );

        const addProductInCart =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                quantity: 5,
            });

        // console.log(JSON.stringify(addProductInCart, null, 2));

        expect(addProductInCart.shoppingCart).toHaveProperty("id");
        expect(addProductInCart.shoppingCart.products[0]).toHaveProperty("id");
    });

    it("should be able to update a product already exist in shopping cart anonymous", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
            admin: true,
        };

        // Create a user
        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(
            product,
            createdUser.id
        );

        // create produto in cart
        const shoppingCart = await createProductsShoppingCartsUseCase.execute({
            id_products: createdProduct.id,
            quantity: 6,
        });

        // update produto in cart
        const updateProductInCart =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                id_shoppingCarts: shoppingCart.shoppingCart.id,
                quantity: 3,
            });
        expect(updateProductInCart.shoppingCart).toHaveProperty("id");
        expect(updateProductInCart.shoppingCart.products[0]).toHaveProperty(
            "id"
        );
    });

    it("should be able to update a product already exist in shopping cart with shoppingCart ID invalid anonymous", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
            admin: true,
        };

        // Create a user
        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(
            product,
            createdUser.id
        );

        // update produto in cart
        await expect(
            createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                id_shoppingCarts: faker.datatype.uuid(),
                quantity: 5,
            })
        ).rejects.toEqual(new AppError("ShoppingCart ID is not valid", 401));
    });

    it("should not be able to add a product to cart with invalid quantity", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
            admin: true,
        };

        // Create a user
        const createdUser = await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(
            product,
            createdUser.id
        );

        const createdCart = await shoppingCartsRepositoryInMemory.create({
            id_users: null,
            subtotal: 0,
            products: [],
        });

        await expect(
            createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                id_shoppingCarts: createdCart.id,
                quantity: 0,
            })
        ).rejects.toEqual(new AppError("Quantity is not valid", 401));
    });

    it("should not be able to add a product to cart with id product invalid", async () => {
        const user: ICreateUserDTO = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.datatype.string(8),
            address: faker.address.streetAddress(),
            admin: true,
        };

        // Create a user
        await createUserUseCase.execute(user);

        // Authenticate a user
        await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        const createdCart = await shoppingCartsRepositoryInMemory.create({
            id_users: null,
            subtotal: 0,
            products: [],
        });

        await expect(
            createProductsShoppingCartsUseCase.execute({
                id_products: faker.datatype.uuid(),
                id_shoppingCarts: createdCart.id,
                quantity: 0,
            })
        ).rejects.toEqual(new AppError("Product is not found", 404));
    });
});
