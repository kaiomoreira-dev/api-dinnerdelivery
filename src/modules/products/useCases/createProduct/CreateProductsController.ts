import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateProductsUseCase } from "./CreateProductsUseCase";

export class CreateProductsController {
    async handle(request: Request, response: Response) {
        const { name, description, unit_price, quantity } = request.body;

        const createProductsUseCase = container.resolve(CreateProductsUseCase);

        const product = await createProductsUseCase.execute({
            name,
            description,
            unit_price,
            quantity,
        });

        return response.status(201).json(product);
    }
}
