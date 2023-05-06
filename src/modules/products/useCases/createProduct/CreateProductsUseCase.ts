import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class CreateProductsUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,
        @inject("UsersRepository")
        private userRepository: IUsersRepository
    ) {}

    async execute(
        { name, description, quantity, unit_price }: ICreateProductsDTO,
        id_users: string
    ): Promise<Products> {
        const userAuthorized = await this.userRepository.findById(id_users);

        if (!userAuthorized) {
            throw new AppError("User not authorized to create products", 401);
        }

        const productsExists = await this.productsRepository.findByName(name);

        if (productsExists) {
            throw new AppError("Product already exists", 401);
        }

        if (quantity <= 0 || !quantity) {
            throw new AppError("Quantity is not valid", 401);
        }

        if (unit_price <= 0 || !unit_price) {
            throw new AppError("Price unit is not valid", 401);
        }

        const product = await this.productsRepository.create({
            name,
            description,
            quantity,
            unit_price,
        });

        return product;
    }
}
