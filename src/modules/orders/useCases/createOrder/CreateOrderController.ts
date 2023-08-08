/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateOrderUseCase } from "./CreateOrderUseCase";

export class CreateOrderController {
    async hundle(request: Request, response: Response): Promise<Response> {
        const createOrderUseCase = container.resolve(CreateOrderUseCase);

        await createOrderUseCase.execute();

        return response
            .status(201)
            .json({ message: "Order created successfully" });
    }
}
