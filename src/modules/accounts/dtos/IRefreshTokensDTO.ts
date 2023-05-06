export interface IRefreshTokensDTO {
  id?: string;
  refresh_token: string;
  expire_date: Date;
  id_users: string;
}
