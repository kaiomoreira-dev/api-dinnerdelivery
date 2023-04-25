/* eslint-disable import/no-extraneous-dependencies */
import { RefreshTokensRepository } from "@modules/accounts/infra/typeorm/repositories/RefreshTokensRepository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { IRefreshTokensRepository } from "@modules/accounts/repositories/IRefreshTokensRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { container } from "tsyringe";

import "./providers";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IRefreshTokensRepository>(
  "RefreshTokensRepository",
  RefreshTokensRepository
);
