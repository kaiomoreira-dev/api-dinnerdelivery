import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteProductInShopingCartUseCase } from "./DeleteProductInShopingCartUseCase";

export class DeleteProductInShopingCartController {
    async handle(request: Request, response: Response) {
        const { id_products, id_shoppingCarts } = request.params;

        const deleteProductInShopingCartUseCase = container.resolve(
            DeleteProductInShopingCartUseCase
        );

        await deleteProductInShopingCartUseCase.execute({
            id_products,
            id_shoppingCarts,
        });

        return response
            .status(204)
            .json({ message: "Product in shoppingCart deleted successfully" });
    }
}
