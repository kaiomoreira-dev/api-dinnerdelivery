import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class UpdateProductUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,
        @inject("UsersRepository")
        private userRepository: IUsersRepository
    ) {}

    async execute(
        { id, name, description, quantity, unit_price }: ICreateProductsDTO,
        id_users: string
    ): Promise<Products> {
        const userAuthorized = await this.userRepository.findById(id_users);

        if (!userAuthorized) {
            throw new AppError("User not authorized to create products", 401);
        }

        const productsExists = await this.productsRepository.findById(id);

        if (!productsExists) {
            throw new AppError("Product not found", 404);
        }

        if (quantity <= 0) {
            throw new AppError("Quantity is not valid", 401);
        }

        if (unit_price <= 0 || !unit_price) {
            throw new AppError("Price unit is not valid", 401);
        }

        await this.productsRepository.updateById({
            id: productsExists.id,
            name,
            description,
            quantity,
            unit_price,
        });

        return productsExists;
    }
}
