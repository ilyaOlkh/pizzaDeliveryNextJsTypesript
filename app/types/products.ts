import { Database } from "./databaseSchema";

export interface IProductInfo {
    id: number;
    size_cm: Database['pizzadetails']['size_cm']
    weight_g: number;
    price: number;
    p_name: Database['product']['p_name']
    image_url: string;
}

export interface IProduct {
    product_id: number;
    p_type: Database['product']['p_type']
    p_name: string;
    added_date: string;
    image_url: string;
    composition: string;
    minprice: number;
    numofprice: number;
    is_available: boolean;
}

export type TypeProductsInfo = IProductInfo[]