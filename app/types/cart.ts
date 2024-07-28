export interface ICartItem {
    id: number
    quantity: number
    dough: string | null
    selled_price: number
}

export type TypeCart = ICartItem[]