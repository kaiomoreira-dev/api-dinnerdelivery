import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class CreateProductsUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute({
        name,
        description,
        quantity,
        unit_price,
    }: ICreateProductsDTO): Promise<Products> {
        if (!name) {
            throw new AppError("Product name is empty", 401);
        }
        const productsExists = await this.productsRepository.findByName(name);

        if (productsExists) {
            throw new AppError("Product already exists", 401);
        }

        if (quantity <= 0) {
            throw new AppError("Quantity is not valid", 401);
        }

        if (unit_price <= 0) {
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
