export interface ICartItem {
    id: number
    quantity: number
    dough: string
    selled_price: number
}

export type TypeCart = ICartItem[]