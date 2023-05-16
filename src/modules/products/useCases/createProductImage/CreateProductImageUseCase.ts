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
        @inject("LocalStorageProvider")
        private localStorageProvider: IStorageProvider
    ) {}

    async execute({ id, product_img }: ICreateProductsDTO): Promise<boolean> {
        if (!id) {
            throw new AppError("Product is empty", 401);
        }
        const productsExists = await this.productsRepository.findById(id);

        if (!productsExists) {
            throw new AppError("Product not found", 404);
        }

        if (!product_img) {
            throw new AppError("Image is empty", 401);
        }

        if (productsExists.product_img) {
            await this.localStorageProvider.delete(
                productsExists.product_img,
                "products"
            );
        }

        await this.localStorageProvider.save(product_img, "products");

        const productImage = await this.productsRepository.updateById({
            id: productsExists.id,
            product_img,
        });

        return productImage;
    }
}
