import {Entity, ManyToOne, OneToOne, PrimaryKey, Property} from "@mikro-orm/decorators/legacy";
import {Products} from "../products/products.entity";
import { Users } from "../users/users.entity";

@Entity()
export class Orders {
    @PrimaryKey({ type: "integer" })
    id: number;

    @Property({ nullable: false, type: "integer" })
    count: number;

    @Property({ nullable: false, type: "varchar" })
    id_order: string;

    @Property({ nullable: false, type: "text" })
    contact_info: string;

    @Property({ onCreate: () => new Date(), type: "datetime" })
    created_at: string;

    @Property({ type: "text" })
    remark: string;

    @Property({ nullable: true, type: "varchar" })
    status: string | null;

    @Property({ type: "varchar" })
    first_name: string;

    @Property({ type: "varchar" })
    last_name: string;

    @Property({ type: "varchar" })
    admin_note: string;

    user_id: number;

    product_id: number;
    
    @OneToOne({ entity: () => Products, nullable: true, fieldName: "product_id", unique: false })
    product?: Products | number;

    @ManyToOne(() => Users, { fieldName: "user_id", deleteRule: "cascade" })
    user: Users | number;
}
