'use client'
import { FormEvent, useContext } from "react"
import { CartContext, ProductsInfoContext, MyContext } from "../context/contextProvider"
import CartItem from "../ui/CartItem"
import insertOrder from "../CartServerServices/SendCart"
import { flsModules } from "../js/files/modules"
import { show, hide } from "./loading"
import { getTotalPrice } from '../CartClientServises/CartServices';
import { setParam } from "../service/setSearchParam"
import { useSafeContext } from "../service/useSafeContext"

export default function PopupSend() {
    const { cartState, setCart } = useSafeContext(CartContext)
    const { productsInfoState, setProductsInfo } = useSafeContext(ProductsInfoContext)
    const { userState, setUser } = useSafeContext(MyContext);
    let uniqueCartItemKey = 0
    async function sendForm(event: FormEvent<HTMLFormElement>) {
        show()
        if (userState) {
            event.preventDefault()
            const formData = new FormData(event.currentTarget);
            let delivery = formData.get('delivery')
            if (delivery && !(delivery instanceof File) && (delivery === "доставка" || delivery === "самовивіз")) {
                const [res, orderId] = await insertOrder(delivery, 1, userState.customer_id, cartState)
                if (res === 'success') {
                    setCart([])
                    setParam(process.env.NEXT_PUBLIC_ID_FOR_ORDER, orderId)
                    // flsModules.popup.close('#send')
                    flsModules.popup.open('#cheque')
                } else {
                    alert('щось пішло не так')
                }
            } else {
                console.log('неправильный формат delivery')
            }
            hide()
        } else {
            console.log('нельзя отправлять заказы без авторизации')
        }
    }
    return <>
        <div id="send" aria-hidden="true" className="popup popup-window">
            <div className="popup__wrapper">
                <form onSubmit={sendForm} method="POST" className="popup__content popup-from-left__body">
                    <button data-close="data-close" type="button" className="popup__close">
                        <img src="/Common/CrossWhite.svg" alt="Cross" />
                    </button>
                    <div className="popup__inner-wrapper">
                        <div className="popup__header popup__header">
                            <h2 className="popup__title popup__title">Уточнення замовлення</h2>
                        </div>
                        <div className="popup-window__inner popup-window__inner_product">
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
                        <div className="popup-window__total">{`Загалом: ${getTotalPrice(cartState, productsInfoState)} ₴`}</div>
                        <div className="popup-window__clarification clarification">

                            <div className="clarification__title">
                                Доставка
                            </div>
                            <div className="block-buttons">
                                <label className="block-buttons__option">
                                    <input type="radio" defaultChecked value="доставка" name="delivery" style={{ display: 'none' }} /><span id="word_opts">Доставка</span>
                                </label>
                                <label className="block-buttons__option">
                                    <input type="radio" value="самовивіз" name="delivery" style={{ display: 'none' }} /><span id="word_opts">Самовивіз</span>
                                </label>
                            </div>

                        </div>
                        <div className="popup-from-left__buttons">
                            {cartState.length < 1 ?
                                <button disabled className="popup-from-left__button popup-from-left__button_disable" >
                                    виберіть хоча б один товар
                                </button>
                                :
                                <button type="submit" className="popup-from-left__button">
                                    Оформити замовлення
                                </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div >
    </>
}