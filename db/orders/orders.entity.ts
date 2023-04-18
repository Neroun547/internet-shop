import {Entity, OneToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {Products} from "../products/products.entity";
import {OrdersInterface} from "./interfaces/orders.interface";

@Entity()
export class Orders implements OrdersInterface {
    @PrimaryKey()
    id: number;

    @OneToOne({ entity: () => Products })
    product: Products | number;

    @Property({ nullable: false })
    count: number;

    @Property({ nullable: false })
    complete: boolean;

    @Property({ nullable: false })
    id_order: string;

    @Property({ nullable: false })
    contact_info: string;

    @Property({ onCreate: () => new Date() })
    created_at: string;
}
