/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import { ShoppingCarts } from "@modules/shoppingCarts/infra/typeorm/entities/ShoppingCarts";
import { IShoppingCartsRepository } from "@modules/shoppingCarts/repositories/IShoppingCartsRepository";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";

@injectable()
export class FindShoppingCartByIdUseCase {
    constructor(
        @inject("ShoppingCartsRepository")
        private shoppingCartsRepository: IShoppingCartsRepository
    ) {}

    async execute(id: string): Promise<ShoppingCarts> {
        const shoppingCartExists = await this.shoppingCartsRepository.findById(
            id
        );

        if (!shoppingCartExists) {
            throw new AppError("ShoppingCart already exists", 404);
        }

        return shoppingCartExists;
    }
}
