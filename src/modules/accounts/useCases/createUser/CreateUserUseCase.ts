/* eslint-disable import/no-extraneous-dependencies */
import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { Users } from "@modules/accounts/infra/typeorm/entities/Users";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private userRepository: IUsersRepository
    ) {}

    async execute({
        id,
        name,
        email,
        password,
        address,
    }: ICreateUserDTO): Promise<Users> {
        if (password.length < 6 || password.length === 0) {
            throw new AppError("Password low lenght", 401);
        }

        const passwordHash = await hash(password, 8);

        if (!address) {
            throw new AppError("Address is required", 401);
        }

        if (!email) {
            throw new AppError("Email not valid", 401);
        }

        const checkEmailUserExist = await this.userRepository.findByEmail(
            email
        );

        if (checkEmailUserExist) {
            throw new AppError("Email already exists", 401);
        }

        if (name.length < 6 || name.length === 0) {
            throw new AppError("Name is not available", 401);
        }

        const user = await this.userRepository.create({
            id,
            name,
            email,
            password: passwordHash,
            address,
        });

        return user;
    }
}
