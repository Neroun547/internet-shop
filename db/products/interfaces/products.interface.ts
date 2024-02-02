export interface ProductsInterface {
    id?: number;
    name: string;
    description: string;
    price: number | null;
    available: boolean;
    type: string;
    num: number;
    user_id: number;
}
