'use client'
import { CartContext } from '../context/contextProvider'
import { useContext, useEffect } from 'react';
import { setCartCookie } from '../CartServerServices/SetCartCookie';

export default function CartListener() {
    const { cartState, setCart } = useContext(CartContext)
    // useEffect(() => {
    //     setCartCookie(JSON.stringify(cartState))
    //     console.log('карт изменен')
    // }, [cartState])
    return <></>
}