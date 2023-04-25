import { ICreateUserDTO } from "../dtos/CreateUserDTO";
import { Users } from "../infra/typeorm/entities/Users";

export interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<Users>;
    findById(id: string): Promise<Users>;
    findByEmail(email: string): Promise<Users>;
    updateById(
        id: string,
        name?: string,
        address?: string,
        email?: string,
        password?: string
    ): Promise<void>;
    deleteById(id: string): Promise<void>;
}
