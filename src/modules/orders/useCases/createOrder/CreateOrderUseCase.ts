/* eslint-disable import/no-extraneous-dependencies */

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateOrderUseCase {
    constructor(
        @inject("UsersRepository")
        private userRepository: IUsersRepository
    ) {}
    async execute(): Promise<void> {
        console.log("Executing. . .");
    }
}
