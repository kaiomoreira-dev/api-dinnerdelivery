import { Products } from "@modules/products/infra/typeorm/entities/Products";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { inject, injectable } from "tsyringe";

import { ProductMap } from "../findProductById/mapper/ProductMap";

@injectable()
export class ListProductsUseCase {
    constructor(
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository
    ) {}

    async execute(): Promise<Products[]> {
        const products = await this.productsRepository.list();

        const productWithUrl = products.map((product: Products) => {
            return ProductMap.toDTO(product);
        });

        return productWithUrl;
    }
}
