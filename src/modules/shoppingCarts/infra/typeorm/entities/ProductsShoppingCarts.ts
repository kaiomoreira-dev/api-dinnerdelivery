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
import { v4 as uuidv4 } from "uuid";

import { ShoppingCarts } from "./ShoppingCarts";

@Entity("productsShoppingCarts")
export class ProductsShoppingCarts {
    @PrimaryColumn()
    id: string;

    @PrimaryColumn()
    id_products: string;

    @PrimaryColumn()
    id_shoppingCarts?: string;

    @Column("numeric", { precision: 10, scale: 2 })
    unit_price: number;

    @Column()
    quantity: number;

    @ManyToOne(() => ShoppingCarts, (shoppingCarts) => shoppingCarts.id)
    @JoinColumn({ name: "id_shoppingCarts" })
    shoppingCarts?: ShoppingCarts;

    @ManyToOne(() => Products, (product) => product.id)
    @JoinColumn({ name: "id_products" })
    products?: Products;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}
