export interface OrderDetail {
    order_details_id: number;
    order_id: number;
    dough: string | null;
    quantity: number;
    selled_price: number;
    size_cm: "20" | "28" | "33" | null;
    weight_g: number | null;
    p_name: string | null;
    image_url: string;
    hidden?: boolean
}

export type TypeOrderDetails = { [orderId: number]: OrderDetail[] };