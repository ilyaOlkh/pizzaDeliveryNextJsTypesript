'use server'
import { cookies } from "next/headers"
import { TypeCart } from "../types/cart";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
export async function getCartCookie() {
    let cart: TypeCart;
    try {
        const cartCookie: RequestCookie | undefined = cookies().get('cart')
        if (cartCookie) {
            cart = JSON.parse(cartCookie.value);
            console.log('cart get success')
        } else {
            cart = []
            console.log('cart get success but its empty')
        }
    } catch (e) {
        console.log('проблема с определением корзины:', e)
        console.log('заменяю на []')
        cart = []
        console.log('cart get isnt success')
    }
    return cart

}