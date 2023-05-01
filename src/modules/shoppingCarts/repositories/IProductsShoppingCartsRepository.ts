import { ICreateProductsShoppingCartsDTO } from "../dtos/ICreateProductsShoppingCartsDTO";
import { ProductsShoppingCarts } from "../infra/typeorm/entities/ProductsShoppingCarts";

export interface IProductsShoppingCartsRepository {
  create(data: ICreateProductsShoppingCartsDTO): Promise<ProductsShoppingCarts>;

  listProductsInShoppingCart(
    id_shoppingCarts: string
  ): Promise<ProductsShoppingCarts[]>;

  findProductInShoppingCart(
    id_products: string,
    id_shoppingCarts: string
  ): Promise<ProductsShoppingCarts>;

  updateById(
    id_shoppingCarts: string,
    id_products: string,
    quantity: number
  ): Promise<void>;
}
