'use client'
import { CartContext } from '../context/contextProvider'
import { useContext } from 'react';



export default function CartItem({ productData, number, lock = false }) {
    const { cartState, setCart } = useContext(CartContext)
    let info = !lock ? cartState[number] : productData
    function incQuantity() {
        if (!lock) {
            let newCartState = [...cartState]
            newCartState[number].quantity++
            setCart(newCartState)
        }
    }

    function decQuantity() {
        if (!lock) {
            if (cartState[number].quantity > 0) {
                let newCartState = [...cartState]
                newCartState[number].quantity--
                setCart(newCartState)
            }
        }
    }

    function deleteItem(event) {
        event.preventDefault()
        if (!lock) {
            let newCartState = [...cartState]
            newCartState.splice(number, 1);
            setCart(newCartState)
        }
    }
    return <>
        <div className="cart-item">
            {productData ? <>
                <img className="cart-item__img" src={productData?.image_url.split('img')[1]} alt="pizza" />
                <div className="cart-item__content">
                    <div className="cart-item__info-block">
                        <h3 className="cart-item__title">{productData?.p_name}</h3>
                        <div className="cart-item__info">{
                            (info.dough ? `${info.dough}, ` : ``) +
                            (productData.size_cm ? `${productData?.size_cm} см, ` : ``) +
                            productData?.weight_g + ' г'}</div>
                    </div>
                    <div className="cart-item__row">
                        <div className={"cart-item__quantity quantity " + (!lock ? "" : "quantity_lock")}>
                            {!lock ? <button onClick={decQuantity} className="quantity__button" type="button">-</button> :
                                <></>
                            }
                            {!lock ? <div className="quantity__input">
                                <input readOnly autoсomplete="off" type="text" name="form[]" value={info.quantity} />
                            </div> :
                                <div className="quantity__input">
                                    <div className="quantity__text-lock">
                                        {info.quantity}
                                    </div>
                                </div>
                            }
                            {!lock ? <button onClick={incQuantity} className="quantity__button" type="button">+</button> :
                                <></>
                            }
                        </div>
                        <div className="cart-item__price">{(!lock ? +productData?.price : +productData?.selled_price) * info.quantity} ₴</div>
                        {!lock ? <button onClick={deleteItem} className="cart-item__delete">
                            <img width={15} src="/Common/delete.svg" alt="Cross" />
                        </button> :
                            <></>
                        }
                    </div>
                </div>

            </> : HTMLLoading
            }
        </div >
    </>
}