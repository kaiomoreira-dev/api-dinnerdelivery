import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

export class AuthenticateUserController {
    async hundle(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const authenticateUserUseCase = container.resolve(
            AuthenticateUserUseCase
        );

        const userAuth = await authenticateUserUseCase.execute({
            email,
            password,
        });

        return response.status(200).json(userAuth);
    }
}
