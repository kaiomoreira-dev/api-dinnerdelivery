import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvide";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class CreateProductImageUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,
        @inject("UsersRepository")
        private userRepository: IUsersRepository,
        @inject("LocalStorageProvider")
        private localStorageProvider: IStorageProvider
    ) {}

    async execute(
        { id, product_img }: ICreateProductsDTO,
        id_users: string
    ): Promise<void> {
        const userAuthorized = await this.userRepository.findById(id_users);

        if (!userAuthorized) {
            throw new AppError("User not authorized to create products", 401);
        }

        const productsExists = await this.productsRepository.findById(id);

        if (!productsExists) {
            throw new AppError("Product not found", 404);
        }

        if (productsExists.product_img) {
            await this.localStorageProvider.delete(
                productsExists.product_img,
                "products_img"
            );
        }

        await this.localStorageProvider.save(product_img, "products");

        await this.productsRepository.updateById({
            id: productsExists.id,
            product_img,
        });
    }
}
