import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {UserInterface} from "./interfaces/user.interface";

@Entity()
export class Users implements UserInterface {
    @PrimaryKey()
    id: number;

    @Property({ nullable: false })
    name: string;

    @Property({ nullable: false })
    password: string;

    @Property()
    role: "admin" | "partner";
}
