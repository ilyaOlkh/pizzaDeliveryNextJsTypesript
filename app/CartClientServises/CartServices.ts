'use client'

import { TypeCart } from "../types/cart"
import { TypeProductsInfo } from "../types/products"

export function getTotalPrice(cart: TypeCart, productsData: TypeProductsInfo): number {
    let totalPrice: number = 0
    for (let item in cart) {
        if (productsData[cart[item].id]) {
            totalPrice += +productsData[cart[item].id].price * cart[item].quantity
        }
    }
    return totalPrice
}
