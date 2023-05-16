import { faker } from "@faker-js/faker";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { CreateProductsUseCase } from "@modules/products/useCases/createProduct/CreateProductsUseCase";
import { ProductsShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ProductsShoppingCartsRepositoryInMemory";
import { ShoppingCartsRepositoryInMemory } from "@modules/shoppingCarts/repositories/in-memory/ShoppingCartsRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateProductsShoppingCartsUseCase } from "../addProductInCart/CreateProductsShoppingCartsUseCase";
import { FindShoppingCartByIdUseCase } from "./FindShoppingCartByIdUseCase";

let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createProductsUseCase: CreateProductsUseCase;
let shoppingCartsRepositoryInMemory: ShoppingCartsRepositoryInMemory;
let productsShoppingCartsRepositoryInMemory: ProductsShoppingCartsRepositoryInMemory;
let createProductsShoppingCartsUseCase: CreateProductsShoppingCartsUseCase;
let findShoppingCartByIdUseCase: FindShoppingCartByIdUseCase;

describe("Find product in cart by ID UseCase", () => {
    beforeEach(() => {
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        createProductsUseCase = new CreateProductsUseCase(
            productsRepositoryInMemory
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

        findShoppingCartByIdUseCase = new FindShoppingCartByIdUseCase(
            productsShoppingCartsRepositoryInMemory,
            shoppingCartsRepositoryInMemory
        );
    });

    it("should be able to find a product in shoppingCart for any user anonymous", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(product);

        const addProductInCart =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                quantity: 5,
            });

        const findProductInCart = await findShoppingCartByIdUseCase.execute(
            addProductInCart.shoppingCart.id
        );

        // console.log(JSON.stringify(findProductInCart, null, 2));

        expect(findProductInCart).toHaveProperty("id");
    });

    it("should not be able to add a find in shoppingCart for any user anonymous with ID not exist", async () => {
        const product: ICreateProductsDTO = {
            name: faker.name.fullName(),
            description: faker.commerce.productDescription(),
            quantity: Number(faker.random.numeric()),
            unit_price: 10,
        };

        const createdProduct = await createProductsUseCase.execute(product);

        const addProductInCart =
            await createProductsShoppingCartsUseCase.execute({
                id_products: createdProduct.id,
                quantity: 5,
            });
        const fakerID = faker.datatype.uuid();
        await expect(
            findShoppingCartByIdUseCase.execute(fakerID)
        ).rejects.toEqual(new AppError("ShoppingCart ID is not valid", 401));
    });
});
