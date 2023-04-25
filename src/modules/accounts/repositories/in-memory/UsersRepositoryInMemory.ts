import { ICreateUserDTO } from "@modules/accounts/dtos/CreateUserDTO";
import { Users } from "@modules/accounts/infra/typeorm/entities/Users";

import { IUsersRepository } from "../IUsersRepository";

export class UsersRepositoryInMemory implements IUsersRepository {
    repository: Users[] = [];

    async findById(id: string): Promise<Users> {
        return this.repository.find((user) => user.id === id);
    }
    async create({
        id,
        name,
        email,
        password,
        address,
    }: ICreateUserDTO): Promise<Users> {
        const user = new Users();

        Object.assign(user, {
            id,
            name,
            email,
            password,
            address,
        });
        this.repository.push(user);

        return user;
    }
    async list(): Promise<Users[]> {
        return this.repository;
    }
    async findByEmail(email: string): Promise<Users> {
        return this.repository.find((user) => user.email === email);
    }
    async updateById(
        id: string,
        name?: string,
        address?: string,
        email?: string,
        password?: string
    ): Promise<void> {
        const userIndex = this.repository.findIndex((user) => user.id === id);
        this.repository[userIndex].name = name;
        this.repository[userIndex].email = email;
        this.repository[userIndex].password = password;
        this.repository[userIndex].address = address;
    }
    // async updateById(
    //     id: string,
    //     name: string,
    //     email: string,
    //     password: string,
    //     address: string
    // ): Promise<Users> {
    //     const produtoIndex = this.repository.findIndex(
    //         (produto) => produto.id === id
    //     );

    //     this.repository[produtoIndex].name = name;
    //     this.repository[produtoIndex].email = email;

    //     const prdoutoUpdated = this.repository.find(
    //         (produto) => produto.id === id
    //     );

    //     return prdoutoUpdated;
    // }
    async deleteById(id: string): Promise<void> {
        const userIndex = this.repository.findIndex((user) => user.id === id);

        this.repository.splice(userIndex, 1);
    }
}
