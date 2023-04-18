import {Products} from "../../products/products.entity";

export interface OrdersInterface {
    id?: number;
    product: Products | number;
    count: number;
    complete: boolean;
    id_order: string;
    contact_info: string;
    created_at?: string;
}
