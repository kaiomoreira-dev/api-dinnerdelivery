/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "./CreateUserUseCase";

export class CreateUserController {
    async hundle(request: Request, response: Response): Promise<Response> {
        const { name, password, email, address } = request.body;

        const createUserUseCase = container.resolve(CreateUserUseCase);

        await createUserUseCase.execute({
            name,
            password,
            email,
            address,
        });

        return response
            .status(201)
            .json({ message: "User created successfully" });
    }
}
