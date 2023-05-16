import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class DeleteProductUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute({ id }: ICreateProductsDTO): Promise<boolean> {
        const productsExists = await this.productsRepository.findById(id);

        if (!productsExists) {
            throw new AppError("Product not found", 404);
        }

        const deleteProduct = await this.productsRepository.deleteById(
            productsExists.id
        );

        return deleteProduct;
    }
}
