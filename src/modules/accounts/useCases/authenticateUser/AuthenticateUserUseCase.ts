/* eslint-disable import-helpers/order-imports */
/* eslint-disable import/no-extraneous-dependencies */
import auth from "@config/auth";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

import { IRefreshTokensRepository } from "@modules/accounts/repositories/IRefreshTokensRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

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
    refresh_token: string;
}

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private userRepository: IUsersRepository,
        @inject("RefreshTokensRepository")
        private refreshTokensRepository: IRefreshTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: DayjsDateProvider
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

        const token = sign({ name, userEmail }, auth.secret_token, {
            subject: String(id),
            expiresIn: auth.expire_in_token,
        });

        const refresh_token = sign({ userEmail }, auth.secret_refresh_token, {
            subject: String(id),
            expiresIn: auth.expire_refresh_token,
        });

        const expireDateFormat = this.dateProvider.addDays(
            auth.days_refresh_token
        );

        await this.refreshTokensRepository.create({
            id_users: id,
            refresh_token,
            expire_date: expireDateFormat,
        });

        const userInfo: IResponse = {
            user: {
                name,
                email,
            },
            token,
            refresh_token,
        };

        return userInfo;
    }
}
