import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Users } from "./Users";

@Entity("refreshTokens")
export class RefreshTokens {
    @PrimaryColumn()
    id: string;

    @Column()
    refresh_token: string;

    @Column()
    expire_date: Date;

    @ManyToOne(() => Users)
    @JoinColumn({ name: "id_users" })
    user: Users;

    @Column()
    id_users: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}
