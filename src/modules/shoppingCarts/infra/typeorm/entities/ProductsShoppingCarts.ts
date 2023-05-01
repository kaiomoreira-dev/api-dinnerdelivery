import { Products } from "@modules/products/infra/typeorm/entities/Products";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

import { ShoppingCarts } from "./ShoppingCarts";

@Entity("productsShoppingCarts")
export class ProductsShoppingCarts {
    @PrimaryColumn()
    id_products: string;

    @PrimaryColumn()
    id_shoppingCarts: string;

    @Column()
    unit_price: number;

    @Column()
    quantity: number;

    @ManyToOne(() => ShoppingCarts, (shoppingCarts) => shoppingCarts.id)
    @JoinColumn({ name: "id_shoppingCarts" })
    shoppingCarts: ShoppingCarts;

    @ManyToOne(() => Products, (product) => product.id)
    @JoinColumn({ name: "id_products" })
    products: Products;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
