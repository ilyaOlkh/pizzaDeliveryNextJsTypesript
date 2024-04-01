'use client'
import { CartContext } from '../context/contextProvider'
import { ProductsInfoContext } from '../context/contextProvider';
import { useContext, useEffect, useState } from 'react';
import { getProductsByIDs } from '../service/getProductsByIDs';
import CartItem from '../ui/CartItem';
import { getTotalPrice } from '../CartClientServises/CartServices';

export default function PopupCart() {
    const { cartState, setCart } = useContext(CartContext)
    const { productsInfoState, setProductsInfo } = useContext(ProductsInfoContext)

    let uniqueCartItemKey = 0

    useEffect(() => {
        const fetchProductData = async () => {
            const dataArray = [...productsInfoState];
            let IDs = []
            cartState.forEach((item) => {
                if (!productsInfoState[item.id]) {
                    IDs.push(item.id)
                }
            })
            console.log(IDs)
            if (IDs.length > 0) {
                const data = await getProductsByIDs(IDs);
                data.forEach((elem) => {
                    dataArray[elem.id] = elem
                })
                setProductsInfo(dataArray);
                console.log(productsInfoState)
            }
        };
        fetchProductData();
    }, [cartState]);

    return <>
        <div id="cart" aria-hidden="true" className="popup popup-from-left">
            <div className="popup__wrapper">
                <form action="" method="POST" className="popup__content popup-from-left__body">
                    <div className="popup-from-left__header popup__header">
                        <h2 className="popup-from-left__title popup__title">Корзина</h2>
                        <button data-close="data-close" type="button" className="popup__close">
                            <img src="/Common/Cross.svg" alt="Cross" />
                        </button>
                    </div>
                    <div className="popup-from-left__cart">
                        {
                            cartState.map((item, num) => {
                                uniqueCartItemKey++
                                return (
                                    <CartItem key={uniqueCartItemKey} productData={productsInfoState[item.id]} number={num} />
                                )
                            })
                        }
                    </div>
                    <div className="popup-from-left__buttons">
                        <div className="popup-from-left__total">{`Итого: ${getTotalPrice(cartState, productsInfoState)} ₴`}</div>
                        <input type="submit" value="Оформить заказ" />
                    </div>
                </form>
            </div >
        </div >
    </>
}