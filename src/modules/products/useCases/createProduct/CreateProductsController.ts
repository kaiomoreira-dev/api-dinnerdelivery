import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateProductsUseCase } from "./CreateProductsUseCase";

export class CreateProductsController {
    async handle(request: Request, response: Response) {
        const { name, description, unit_price, quantity } = request.body;
        const { id: id_users } = request.user;

        const createProductsUseCase = container.resolve(CreateProductsUseCase);

        const product = await createProductsUseCase.execute(
            {
                name,
                description,
                unit_price,
                quantity,
            },
            id_users
        );

        return response.status(201).json(product);
    }
}
