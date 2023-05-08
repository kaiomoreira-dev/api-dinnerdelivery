import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateShoppingCartUseCase } from "./UpdateShoppingCartUseCase";

export class UpdateShoppingCartController {
    async handle(request: Request, response: Response) {
        const { id_products, id_shoppingCarts, quantity } = request.params;

        const qunatityNumber = Number(quantity);

        const updateShoppingCartUseCase = container.resolve(
            UpdateShoppingCartUseCase
        );

        await updateShoppingCartUseCase.execute({
            id_shoppingCarts,
            id_products,
            quantity: qunatityNumber,
        });

        return response
            .status(200)
            .json({ message: "Update Shopping Cart Successfully!" });
    }
}
