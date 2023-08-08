/* eslint-disable import/no-extraneous-dependencies */
import { faker } from "@faker-js/faker";
import { IRefreshTokensDTO } from "@modules/accounts/dtos/IRefreshTokensDTO";
import { RefreshTokens } from "@modules/accounts/infra/typeorm/entities/RefreshTokens";

import { IRefreshTokensRepository } from "../IRefreshTokensRepository";

export class RefreshTokensRepositoryInMemory
    implements IRefreshTokensRepository
{
    private usersTokens: RefreshTokens[] = [];

    async create({
        refresh_token,
        expire_date,
        id_users,
    }: IRefreshTokensDTO): Promise<RefreshTokens> {
        const refreshToken = new RefreshTokens();

        const generateID = faker.datatype.uuid();

        Object.assign(refreshToken, {
            id: generateID,
            refresh_token,
            expire_date,
            id_users,
        });

        this.usersTokens.push(refreshToken);

        return refreshToken;
    }
    async findRefreshTokenByUserIdAndRefreshToken(
        id_users: string,
        refresh_token: string
    ): Promise<RefreshTokens> {
        const refreshToken = this.usersTokens.find(
            (token) =>
                token.id_users === id_users &&
                token.refresh_token === refresh_token
        );

        return refreshToken;
    }
    async deleteById(id: string): Promise<void> {
        const refreshToken = this.usersTokens.find(
            (token) => token.id_users === id
        );

        this.usersTokens.splice(this.usersTokens.indexOf(refreshToken));
    }
}
