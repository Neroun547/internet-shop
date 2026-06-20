import {Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/decorators/legacy";
import {ProductsImages} from "../products-images/products-images.entity";
import { Collection } from "@mikro-orm/core";
import { Users } from "../users/users.entity";

@Entity()
export class Products {
    @PrimaryKey({ type: "integer" })
    id: number;

    @Property({ type: "varchar" })
    name: string;

    @Property({ type: "text" })
    description: string;

    @Property({ nullable: true, type: "float" })
    price: number | null;

    @Property({ type: "bool" })
    available: boolean;

    @Property({ type: "varchar" })
    type: string;

    @Property({ type: "integer" })
    num: number;

    user_id: number;

    @Property({ type: "integer" })
    rubric_id: number;

    @OneToMany({ entity: () => ProductsImages, mappedBy: 'product' })
    productsImages = new Collection<ProductsImages>(this);

    @ManyToOne(() => Users, { fieldName: "user_id", deleteRule: "cascade" })
    user: Users | number;
}
