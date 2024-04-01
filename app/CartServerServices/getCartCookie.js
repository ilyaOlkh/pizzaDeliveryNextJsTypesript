'use server'
import { cookies } from "next/headers"
export async function getCartCookie() {
    let cart;
    try {
        console.log(cookies().get('cart').value)
        cart = JSON.parse(cookies().get('cart').value);
        console.log('cart get success')

    } catch (e) {
        console.log('проблема с определением корзины:', e)
        console.log('заменяю на []')
        cart = []
        console.log('cart get isnt success')
    }
    return cart

}