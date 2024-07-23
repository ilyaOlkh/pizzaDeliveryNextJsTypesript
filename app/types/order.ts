export interface IOrder {
    order_id: number;
    order_date_time: string;
    status: 'готується' | 'доставляється' | 'доставлено' | 'скасовано';
    payment: 'оплачено' | 'потрібно оплатити';
    delivery: 'доставка' | 'самовивіз';
    first_name?: string;
    last_name?: string;
    street: string;
    house: string;
    entrance: string | null;
    floor: number | null;
    apartment: number | null;
    intercom_code: string | null;
    phone: string;
}
export type TypeOrders = IOrder[];
