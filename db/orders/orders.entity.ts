import {Entity, OneToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {Products} from "../products/products.entity";
import {OrdersInterface} from "./interfaces/orders.interface";
import { CustomDateType } from "./types/custom-date.type";

@Entity()
export class Orders implements OrdersInterface {
    @PrimaryKey()
    id: number;

    @OneToOne({ entity: () => Products, nullable: true })
    product: Products;

    @Property({ nullable: false })
    count: number;

    @Property({ nullable: false })
    id_order: string;

    @Property({ nullable: false })
    contact_info: string;

    @Property({ onCreate: () => new Date(), type: CustomDateType })
    created_at: string;

    @Property()
    remark: string;

    @Property({ nullable: true })
    status: string | null;

    @Property()
    first_name: string;

    @Property()
    last_name: string;

    @Property()
    admin_note: string;

    @Property()
    user_id: number;

    @Property()
    product_id: number;
}
