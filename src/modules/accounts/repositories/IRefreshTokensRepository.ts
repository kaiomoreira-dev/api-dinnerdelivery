import { IRefreshTokensDTO } from "../dtos/IRefreshTokensDTO";
import { RefreshTokens } from "../infra/typeorm/entities/RefreshTokens";

export interface IRefreshTokensRepository {
    create(data: IRefreshTokensDTO): Promise<RefreshTokens>;
    findRefreshTokenByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string
    ): Promise<RefreshTokens>;
    deleteById(id: string): Promise<void>;
}
