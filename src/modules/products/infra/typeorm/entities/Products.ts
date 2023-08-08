/* eslint-disable import/no-extraneous-dependencies */
import { Expose } from "class-transformer";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("products")
export class Products {
    @PrimaryColumn()
    id?: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column("numeric", { precision: 10, scale: 2 })
    unit_price: number;

    @Column()
    quantity?: number;

    @Column()
    product_img?: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    @Expose({ name: "product_url" })
    product_url?(): string {
        switch (process.env.disk) {
            case "local":
                return `${process.env.API_URL_APP}/products/${this.product_img}`;
            case "s3":
                return `${process.env.AWS_BUCKET_URL}/products/${this.product_img}`;
            default:
                return null;
        }
    }

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}
