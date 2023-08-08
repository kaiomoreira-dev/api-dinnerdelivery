import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Repository } from "typeorm";

import dataSource from "@shared/infra/typeorm";

import { Users } from "../entities/Users";

export class UsersRepository implements IUsersRepository {
    private repository: Repository<Users>;

    constructor() {
        this.repository = dataSource.getRepository(Users);
    }

    async updateById(
        id: string,
        name: string,
        address: string,
        email: string,
        password: string
    ): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({ name, address, email, password })
            .where("id = :id", { id })
            .execute();
    }
    async deleteById(id: string): Promise<void> {
        await this.repository.delete({ id });
    }
    async findById(id: string): Promise<Users> {
        return this.repository.findOneBy({ id });
    }
    async findByEmail(email: string): Promise<Users> {
        return this.repository.findOneBy({ email });
    }
    async create({
        id,
        name,
        email,
        password,
        address,
        admin,
    }: ICreateUserDTO): Promise<Users> {
        const user = this.repository.create({
            id,
            name,
            email,
            password,
            address,
            admin,
        });

        await this.repository.save(user);

        return user;
    }
}
