import auth from "@config/auth";
import { IRefreshTokensRepository } from "@modules/accounts/repositories/IRefreshTokensRepository";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
    sub: string;
    email: string;
}

interface ITokenResponse {
    refresh_token: string;
    token: string;
}

@injectable()
export class RefreshTokenUseCase {
    constructor(
        @inject("RefreshTokensRepository")
        private refreshTokensRepository: IRefreshTokensRepository,
        @inject("DayjsDateProvider")
        private daysjsDateProvider: IDateProvider
    ) {}

    async execute(token: string): Promise<ITokenResponse> {
        try {
            const { sub, email } = verify(
                token,
                auth.secret_refresh_token
            ) as IPayload;

            const user_id = sub;

            const userToken =
                await this.refreshTokensRepository.findRefreshTokenByUserIdAndRefreshToken(
                    user_id,
                    token
                );

            if (!userToken) {
                throw new AppError("Refresh token not found");
            }

            await this.refreshTokensRepository.deleteById(userToken.id);

            const refresh_token = sign({ email }, auth.secret_refresh_token, {
                subject: user_id,
                expiresIn: auth.expire_refresh_token,
            });

            const expire_date_refresh_token = this.daysjsDateProvider.addDays(
                auth.days_refresh_token
            );

            await this.refreshTokensRepository.create({
                id_users: user_id,
                refresh_token,
                expire_date: expire_date_refresh_token,
            });

            const newToken = sign({}, auth.secret_token, {
                subject: user_id,
                expiresIn: auth.expire_in_token,
            });

            return {
                refresh_token,
                token: newToken,
            };
        } catch (error) {
            throw new AppError("Token not valid", 401);
        }
    }
}
