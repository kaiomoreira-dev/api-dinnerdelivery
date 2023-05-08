import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateProductsShoppingCartsUseCase } from "./CreateProductsShoppingCartsUseCase";

export class CreateProductsShoppingCartsController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { idProducts, quantity, idShoppingCarts } = request.params;

        const quantityFormat = Number(quantity);
        const createProductsShoppingCartsUseCase = container.resolve(
            CreateProductsShoppingCartsUseCase
        );

        await createProductsShoppingCartsUseCase.execute({
            id_products: idProducts,
            id_shoppingCarts: idShoppingCarts,
            quantity: quantityFormat,
        });

        return response
            .status(200)
            .json({ message: "ShoppingCart updated successfully" });
    }
}
