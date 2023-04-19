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
        name,
        email,
        password,
        address,
    }: ICreateUserDTO): Promise<Users> {
        const passwordHash = await hash(password, 8);

        const checkEmailUserExist = await this.userRepository.findByEmail(
            email
        );

        if (checkEmailUserExist) {
            throw new AppError("Email already exists!");
        }

        const user = await this.userRepository.create({
            name,
            email,
            password: passwordHash,
            address,
        });

        return user;
    }
}
