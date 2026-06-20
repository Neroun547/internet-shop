import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/decorators/legacy";
import {Products} from "../products/products.entity";

@Entity()
export class ProductsImages {
    @PrimaryKey({ type: "integer" })
    id: number;

    @Property({ type: "varchar" })
    file_name: string;

    @ManyToOne({ entity: () => Products, fieldName: "product_id" })
    product: Products | number;

    product_id: number;
}
