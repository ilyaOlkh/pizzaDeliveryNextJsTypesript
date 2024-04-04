'use client'
import { useContext } from "react"
import { CartContext, ProductsInfoContext, MyContext } from "../context/contextProvider"
import CartItem from "../ui/CartItem"
import insertOrder from "../CartServerServices/SendCart"
import { flsModules } from "../js/files/modules"
import { show, hide } from "./loading"

export default function PopupSend() {
    const { cartState, setCart } = useContext(CartContext)
    const { productsInfoState, setProductsInfo } = useContext(ProductsInfoContext)
    const { userState, setUser } = useContext(MyContext);
    let uniqueCartItemKey = 0
    async function sendForm(event) {
        show()
        event.preventDefault()
        const formData = new FormData(event.target);
        let delivery = formData.get('delivery')
        console.log(userState)
        const res = await insertOrder(delivery, 1, userState.customer_id, cartState)
        if (res === 'success') {
            setCart([])
            flsModules.popup.close('#send')
        } else {
            alert('что-то пошло не так')
        }
        hide()

    }
    return <>
        <div id="send" aria-hidden="true" className="popup popup-window">
            <div className="popup__wrapper">
                <form onSubmit={sendForm} method="POST" className="popup__content popup-from-left__body">
                    <button data-close="data-close" type="button" className="popup__close">
                        <img src="/Common/CrossWhite.svg" alt="Cross" />
                    </button>
                    <div className="popup__inner-wrapper">
                        <div className="popup-from-left__header popup__header">
                            <h2 className="popup-from-left__title popup__title">Уточнение заказа</h2>
                        </div>
                        <div className="popup-from-left__inner">
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
                        <div className="popup-from-left__clarification clarification">
                            <div className="clarification__title">
                                Доставка
                            </div>
                            <div className="block-buttons">
                                <label className="block-buttons__option">
                                    <input type="radio" defaultChecked value="доставка" name="delivery" style={{ display: 'none' }} /><span id="word_opts">Доставка</span>
                                </label>
                                <label className="block-buttons__option">
                                    <input type="radio" value="самовывоз" name="delivery" style={{ display: 'none' }} /><span id="word_opts">Самовывоз</span>
                                </label>
                            </div>
                        </div>
                        <div className="popup-from-left__buttons">
                            {cartState.length < 1 ?
                                <button disabled className="popup-from-left__button popup-from-left__button_disable" >
                                    выберите хотя-бы один товар
                                </button>
                                :
                                <button type="submit" className="popup-from-left__button">
                                    Оформить заказ
                                </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div >
    </>
}