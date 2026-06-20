import { ProductsImagesInterface } from "src/db/products-images/interfaces/products-images.interface";

export interface ProductsInterface {
    id?: number;
    name: string;
    description: string;
    price: number | null;
    available: boolean;
    type: string;
    num: number;
    user_id: number;
    rubric_id: number;
    productsImages?: ProductsImagesInterface[]; 
}
