'use server'
import { cookies } from "next/headers"
export async function setCartCookie(cartString: string): Promise<void> {
    cookies().set('cart', cartString, { maxAge: 30 * 24 * 60 * 60 * 1000 })
    console.log('cart changed')
}