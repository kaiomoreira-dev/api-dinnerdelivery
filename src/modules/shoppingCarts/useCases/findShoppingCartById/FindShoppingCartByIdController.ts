import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindShoppingCartByIdUseCase } from "./FindShoppingCartByIdUseCase";

export class FindShoppingCartByIdController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        const findShoppingCartByIdUseCase = container.resolve(
            FindShoppingCartByIdUseCase
        );

        const shoppingCart = await findShoppingCartByIdUseCase.execute(id);

        return response.status(200).json(shoppingCart);
    }
}
