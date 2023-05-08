import { Products } from "@modules/products/infra/typeorm/entities/Products";

export interface ICreateProductsShoppingCartsDTO {
  id_products?: string;
  id_shoppingCarts?: string;
  id_users?: string;
  unit_price?: number;
  quantity?: number;
  products?: Products[];
  subtotal?: number;
}
