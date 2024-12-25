import {Products} from "../../products/products.entity";

export interface OrdersInterface {
    id?: number;
    product?: Products;
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
