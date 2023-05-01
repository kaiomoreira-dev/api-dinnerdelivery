import { Products } from "@modules/products/infra/typeorm/entities/Products";

export interface ICreateShoppingCartsDTO {
  id?: string;
  id_users?: string;
  products?: Products[];
  subtotal?: number;
}
