import { IRefreshTokensDTO } from "@modules/accounts/dtos/IRefreshTokensDTO";
import { IRefreshTokensRepository } from "@modules/accounts/repositories/IRefreshTokensRepository";
import { Repository } from "typeorm";

import dataSource from "@shared/infra/typeorm";

import { RefreshTokens } from "../entities/RefreshTokens";

export class RefreshTokensRepository implements IRefreshTokensRepository {
    private repository: Repository<RefreshTokens>;

    constructor() {
        this.repository = dataSource.getRepository(RefreshTokens);
    }
    async create({
        id_users,
        expire_date,
        refresh_token,
    }: IRefreshTokensDTO): Promise<RefreshTokens> {
        const createRefreshTokensUser = this.repository.create({
            id_users,
            expire_date,
            refresh_token,
        });

        await this.repository.save(createRefreshTokensUser);

        return createRefreshTokensUser;
    }
    async findRefreshTokenByUserIdAndRefreshToken(
        id_users: string,
        refresh_token: string
    ): Promise<RefreshTokens> {
        const findRefreshTokenUser = await this.repository.findOneBy({
            id_users,
            refresh_token,
        });

        return findRefreshTokenUser;
    }
    async findRefreshTokenByUserId(id_users: string): Promise<RefreshTokens> {
        const findRefreshTokenUser = await this.repository.findOneBy({
            id_users,
        });

        return findRefreshTokenUser;
    }
    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
