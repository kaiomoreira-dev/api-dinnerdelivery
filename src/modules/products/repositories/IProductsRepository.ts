import { ICreateProductsDTO } from "../dtos/ICreateProductsDTO";
import { Products } from "../infra/typeorm/entities/Products";

export interface IProductsRepository {
  create(data: ICreateProductsDTO): Promise<Products>;
  list(): Promise<Products[]>;
  findById(id: string): Promise<Products>;
  findByName(name: string): Promise<Products>;
  updateById(
    id: string,
    name?: string,
    description?: string,
    quantity?: number,
    unit_price?: number
  ): Promise<void>;

  deleteById(id: string): Promise<void>;
}
