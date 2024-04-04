'use client'
import { CartContext } from '../context/contextProvider'
import { ProductsInfoContext, MyContext } from '../context/contextProvider';
import { useContext } from 'react';
import CartItem from '../ui/CartItem';
import { getTotalPrice } from '../CartClientServises/CartServices';

export default function PopupCart() {
    const { cartState, setCart } = useContext(CartContext)
    const { productsInfoState, setProductsInfo } = useContext(ProductsInfoContext)
    const { userState, setUser } = useContext(MyContext);
    console.log(userState)
    console.log(productsInfoState)
    let uniqueCartItemKey = 0

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
                    <div className="popup-from-left__cart popup-from-left__inner">
                        {
                            cartState.map((item, num) => {
                                console.log('перерендер')
                                uniqueCartItemKey++
                                return (
                                    <CartItem key={uniqueCartItemKey} productData={productsInfoState[item.id]} number={num} />
                                )
                            })
                        }
                    </div>
                    <div className="popup-from-left__buttons">
                        <div className="popup-from-left__total">{`Итого: ${getTotalPrice(cartState, productsInfoState)} ₴`}</div>
                        {
                            !userState ?
                                <button disabled className="popup-from-left__button popup-from-left__button_disable">
                                    войдите в аккаунт
                                </button> :
                                cartState.length < 1 ?
                                    <button disabled className="popup-from-left__button popup-from-left__button_disable" >
                                        выберите хотя-бы один товар
                                    </button>
                                    :
                                    <button className="popup-from-left__button" data-popup="#send" >
                                        Оформить заказ
                                    </button>
                        }
                    </div>
                </form>
            </div >
        </div >
    </>
}