/* eslint-disable import/no-extraneous-dependencies */
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { Users } from "@modules/accounts/infra/typeorm/entities/Users";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class CreateUserUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute({
        name,
        email,
        password,
        address,
        admin,
    }: ICreateUserDTO): Promise<Users> {
        if (password.length < 6) {
            throw new AppError("Password low lenght", 401);
        }

        const passwordHash = await hash(password, 8);

        if (!address) {
            throw new AppError("Address is required", 401);
        }

        if (!email) {
            throw new AppError("Email not valid", 401);
        }

        const checkEmailUserExist = await this.usersRepository.findByEmail(
            email
        );

        if (checkEmailUserExist) {
            throw new AppError("Email already exists", 401);
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password: passwordHash,
            address,
            admin,
        });

        return user;
    }
}
