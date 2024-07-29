'use client'
import { CartContext } from '../context/contextProvider'
import { IProductInfo } from '../types/products';
import { useSafeContext } from '../service/useSafeContext';
import { MouseEvent } from 'react';



export default function CartItem({ productData, number }: { productData: IProductInfo, number: number }) {
    const { cartState, setCart } = useSafeContext(CartContext)
    let info = cartState[number]
    function incQuantity() {
        let newCartState = [...cartState]
        newCartState[number].quantity++
        setCart(newCartState)
    }

    function decQuantity() {
        if (cartState[number].quantity > 0) {
            let newCartState = [...cartState]
            newCartState[number].quantity--
            setCart(newCartState)
        }
    }

    function deleteItem(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        let newCartState = [...cartState]
        newCartState.splice(number, 1);
        setCart(newCartState)
    }
    return (
        <div className="cart-item" >
            < img className="cart-item__img" src={productData?.image_url.split('img')[1]} alt="pizza" />
            <div className="cart-item__content" >
                <div className="cart-item__info-block" >
                    <h3 className="cart-item__title" > {productData?.p_name} </h3>
                    < div className="cart-item__info" > {
                        (info?.dough ? `${info.dough}, ` : ``) +
                        (productData.size_cm ? `${productData?.size_cm} см, ` : ``) +
                        productData?.weight_g + ' г'
                    } </div>
                </div>
                < div className="cart-item__row" >
                    <div className={"cart-item__quantity quantity"}>
                        <button onClick={decQuantity} className="quantity__button" type="button" > -</button>
                        < div className="quantity__input" >
                            <input readOnly autoComplete="off" type="text" name="form[]" value={info.quantity} />
                        </div>
                        < button onClick={incQuantity} className="quantity__button" type="button" > +</button>
                    </div>
                    < div className="cart-item__price" > {(+productData?.price) * info.quantity} ₴</div>
                    < button onClick={deleteItem} type='button' className="cart-item__delete" >
                        <img width={15} src="/Common/delete.svg" alt="Cross" />
                    </button>
                </div>
            </div>
        </div >
    )
}