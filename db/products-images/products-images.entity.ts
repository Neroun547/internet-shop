import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {ProductsImagesInterface} from "./interfaces/products-images.interface";
import {Products} from "../products/products.entity";

@Entity()
export class ProductsImages implements ProductsImagesInterface {
    @PrimaryKey()
    id: number;

    @Property()
    file_name: string;

    @ManyToOne({ entity: () => Products })
    product: Products;
}
