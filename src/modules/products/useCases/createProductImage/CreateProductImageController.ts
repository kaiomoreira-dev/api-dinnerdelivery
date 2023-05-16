import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { CreateProductImageUseCase } from "./CreateProductImageUseCase";

export class CreateProductImageController {
    async handle(request: Request, response: Response) {
        try {
            const { id: id_products } = request.params;

            const imageName = request.file.filename;

            const createProductImageUseCase = container.resolve(
                CreateProductImageUseCase
            );

            await createProductImageUseCase.execute({
                id: id_products,
                product_img: imageName,
            });

            return response
                .status(200)
                .json({ message: "Product updated successfully" });
        } catch {
            throw new AppError("Image not found", 404);
        }
    }
}
