import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindProductByIdUseCase } from "./FindProductByIdUseCase";

export class FindProductByIdController {
    async handle(request: Request, response: Response) {
        const { id: id_products } = request.params;
        const { id: id_users } = request.user;

        const findProductByIdUseCase = container.resolve(
            FindProductByIdUseCase
        );

        const product = await findProductByIdUseCase.execute(
            { id: id_products },
            id_users
        );

        return response.status(200).json(product);
    }
}
