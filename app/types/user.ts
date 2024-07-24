export interface IUser {
    customer_id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    street: string;
    house: string;
    entrance: string | null;
    floor: number | null;
    apartment: number | null;
    intercom_code: string | null;
    discount: number;
    role: string | null;
}

export interface IUserSecret extends IUser {
    password: string;
}

export interface ITokens {
    accesstoken: string;
    refreshtoken: string;
}

export type customer_id = number | null
