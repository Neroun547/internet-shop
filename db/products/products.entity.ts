import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {ProductsInterface} from "./interfaces/products.interface";
import {ProductsImages} from "../products-images/products-images.entity";

@Entity()
export class Products implements ProductsInterface {

    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @Property()
    description: string;

    @Property({ nullable: true })
    price: number | null;

    @Property()
    available: boolean;

    @Property()
    type: string;

    @OneToMany({ entity: () => ProductsImages, mappedBy: 'product' })
    productsImages = new Collection<ProductsImages>(this);
}
