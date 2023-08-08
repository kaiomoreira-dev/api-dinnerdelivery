import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteProductUseCase } from "./DeleteProductUseCase";

export class DeleteProductController {
    async handle(request: Request, response: Response) {
        const { id: id_products } = request.params;

        const deleteProductUseCase = container.resolve(DeleteProductUseCase);

        await deleteProductUseCase.execute({
            id: id_products,
        });

        return response
            .status(204)
            .json({ message: "Product deleted successfully" });
    }
}
