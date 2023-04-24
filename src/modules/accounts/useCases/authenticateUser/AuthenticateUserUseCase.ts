/* eslint-disable import/no-extraneous-dependencies */
import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
}

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private userRepository: IUsersRepository
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const userExists = await this.userRepository.findByEmail(email);

        if (!userExists) {
            throw new AppError("Email or password incorrect", 401);
        }

        const checkPasswordIsValid = await compare(
            password,
            userExists.password
        );

        if (!checkPasswordIsValid) {
            throw new AppError("Email or password incorrect", 401);
        }

        const { name, id, email: userEmail } = userExists;

        const token = sign({ id, name, userEmail }, auth.secret_token, {
            subject: String(id),
            expiresIn: auth.expire_in_token,
        });

        const userInfo: IResponse = {
            user: {
                name,
                email,
            },
            token,
        };

        return userInfo;
    }
}
