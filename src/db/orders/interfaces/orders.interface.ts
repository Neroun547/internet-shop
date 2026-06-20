import { ProductsInterface } from "src/db/products/interfaces/products.interface";
import {Products} from "../../products/products.entity";

export interface OrdersInterface {
    id?: number;
    product?: Products | ProductsInterface;
    product_id: number;
    count: number;
    id_order: string;
    contact_info: string;
    created_at?: string;
    remark: string;
    status: string | null;
    first_name: string;
    last_name: string;
    admin_note: string;
    user_id: number;
}
