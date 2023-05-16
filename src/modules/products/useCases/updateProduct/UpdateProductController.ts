import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateProductUseCase } from "./UpdateProductUseCase";

export class UpdateProductController {
    async handle(request: Request, response: Response) {
        const { id: id_products } = request.params;
        const { name, description, unit_price, quantity } = request.body;

        const updateProductUseCase = container.resolve(UpdateProductUseCase);

        await updateProductUseCase.execute({
            id: id_products,
            name,
            description,
            unit_price,
            quantity,
        });

        return response
            .status(204)
            .json({ message: "Product updated successfully!" });
    }
}
