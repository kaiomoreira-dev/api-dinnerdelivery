import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateProductImageUseCase } from "./CreateProductImageUseCase";

export class CreateProductImageController {
    async handle(request: Request, response: Response) {
        const { id: id_products } = request.params;
        const { id: id_users } = request.user;

        const imageName = request.file.filename;

        const createProductImageUseCase = container.resolve(
            CreateProductImageUseCase
        );

        await createProductImageUseCase.execute(
            { id: id_products, product_img: imageName },
            id_users
        );

        return response
            .status(200)
            .json({ message: "Product updated successfully" });
    }
}
