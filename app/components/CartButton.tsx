'use client'
import { ProductsInfoContext } from '../context/contextProvider';
import { CartContext } from '../context/contextProvider'
import { useContext, useEffect } from 'react';
import { getTotalPrice } from '../CartClientServises/CartServices';
import { useSafeContext } from '../service/useSafeContext';

export default function CartButton() {
    const { cartState } = useSafeContext(CartContext)
    const { productsInfoState } = useSafeContext(ProductsInfoContext)
    return <>
        <button data-popup="#cart" className="header__basket basket">
            <img src="/Common/basket.svg" alt="basket" className="basket__img" height={20} width={20} />
            <span className="basket__num">{getTotalPrice(cartState, productsInfoState)}</span>
            <span className="basket__Curr">&nbsp;₴</span>
        </button>
    </>
}