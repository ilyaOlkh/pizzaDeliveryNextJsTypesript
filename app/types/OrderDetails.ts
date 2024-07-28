import { Database } from "./databaseSchema";

export interface OrderDetail {
    order_details_id: number;
    order_id: number;
    dough: string | null;
    quantity: number;
    selled_price: number;
    size_cm: Database['pizzadetails']['size_cm']
    weight_g: number | null;
    p_name: string | null;
    image_url: string;
    hidden?: boolean
}

export type TypeOrderDetails = { [orderId: number]: OrderDetail[] };