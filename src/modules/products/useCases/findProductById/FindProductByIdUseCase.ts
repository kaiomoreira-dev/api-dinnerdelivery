import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { ProductMap } from "./mapper/ProductMap";

@injectable()
export class FindProductByIdUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute(id_products: string): Promise<Products> {
        const productsExists = await this.productsRepository.findById(
            id_products
        );

        if (!productsExists) {
            throw new AppError("Product not found", 404);
        }

        return ProductMap.toDTO(productsExists);
    }
}
