import { Users } from "@modules/accounts/infra/typeorm/entities/Users";
import { Products } from "@modules/products/infra/typeorm/entities/Products";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("shoppingCarts")
export class ShoppingCarts {
    @PrimaryColumn()
    id?: string;

    @Column()
    id_users?: string;

    @ManyToOne(() => Users, (users) => users.id)
    @JoinColumn({ name: "id_users" })
    users: Users;

    @Column()
    subtotal: number;

    @ManyToMany(() => Products, (products) => products.id)
    @JoinTable({
        name: "productsShoppingCarts",
        joinColumns: [{ name: "id_shoppingCarts" }],
        inverseJoinColumns: [{ name: "id_products" }],
    })
    products?: Products[];

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
            this.subtotal = 0;
            this.id_users = null;
        }
    }
}
