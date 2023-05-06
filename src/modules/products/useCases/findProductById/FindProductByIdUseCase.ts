import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class FindProductByIdUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,
        @inject("UsersRepository")
        private userRepository: IUsersRepository
    ) {}

    async execute(id_products: string, id_users: string): Promise<Products> {
        const userAuthorized = await this.userRepository.findById(id_users);

        if (!userAuthorized) {
            throw new AppError("User not authorized to create products", 401);
        }

        const productsExists = await this.productsRepository.findById(
            id_products
        );

        if (!productsExists) {
            throw new AppError("Product not found", 404);
        }

        return productsExists;
    }
}