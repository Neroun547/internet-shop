import { ProductsInterface } from "src/db/products/interfaces/products.interface";

export interface ProductsImagesInterface {
    id?: number;
    file_name: string;
    product?: ProductsInterface | number;
    product_id: number;
}
