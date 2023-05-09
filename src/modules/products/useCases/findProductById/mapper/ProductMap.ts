import { ICreateProductsDTO } from "@modules/products/dtos/ICreateProductsDTO";
import { instanceToInstance } from "class-transformer";

export class ProductMap {
    static toDTO({
        id,
        name,
        description,
        unit_price,
        quantity,
        product_img,
        product_url,
    }: ICreateProductsDTO) {
        const product = instanceToInstance({
            id,
            name,
            description,
            unit_price,
            quantity,
            product_img,
            product_url,
        });

        return product;
    }
}
