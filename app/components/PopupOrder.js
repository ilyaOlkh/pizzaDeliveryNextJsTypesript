'use client'
import { useContext, useState, useEffect, useRef } from "react"
import { MyContext, OrdersContext, OrdersDetailsContext, isAdminContext } from "../context/contextProvider"
import CartItem from "../ui/CartItem"
import OrderSelect from "./OrderSelect"
import { updateOrder } from "../service/updateOrder"


const orderHash = '#' + process.env.NEXT_PUBLIC_POPUP_ORDER_HASH

export default function PopupOrder() {
    const { ordersState, setOrders } = useContext(OrdersContext)
    const { ordersDetailsState, setOrdersDetails } = useContext(OrdersDetailsContext)
    const { isAdminState, setIsAdmin } = useContext(isAdminContext)
    const { userState, setUser } = useContext(MyContext)
    const [orderIdState, setOrderId] = useState(0)
    console.log(ordersState, ordersDetailsState)

    let uniqueCartItemKey = 0

    async function onSubmit(event) {
        event.preventDefault()
        if (isAdminState) {
            let Changes = {}
            const formData = new FormData(event.target);
            const formObj = Object.fromEntries(formData.entries())
            const keys = Object.keys(formObj)
            const thisOrder = ordersState[orderIdState]
            console.log(formObj)
            if (thisOrder) {
                keys.forEach((key) => {
                    if (thisOrder[key] && thisOrder[key] != formObj[key]) {
                        Changes[key] = formObj[key]
                    }
                })
            }
            console.log(Changes)
            let res;
            if (Object.keys(Changes).length > 0) {
                res = await updateOrder(Changes, orderIdState)
            }
            if (res == 'no access') {
                setIsAdmin(false)
                alert('отказано в доступе!')
            }
            if (res == 'Order updated successfully') {
                let newOrdersState = { ...ordersState }
                Object.entries(Changes).forEach(([key, value]) => {
                    newOrdersState[orderIdState][key] = value
                })
                setOrders(newOrdersState)
            }
            console.log(res, ordersState)
        }
    }

    useEffect(() => {

        function getOrderId(e) {
            if (e.detail.popup.hash == orderHash) {
                let search = window.location.search
                const params = new URLSearchParams(search)
                const orderIdFromHash = params.get(process.env.NEXT_PUBLIC_ID_FOR_ORDER)
                setOrderId(+orderIdFromHash)
                // orderIdState = +orderIdFromHash
                console.log(orderIdState)
            }
            // if (document.querySelector(orderHash).dataset.orderId != orderIdFromHash) {
            //     console.log(ordersState, orderIdFromHash)
            //     if (ordersState[orderIdFromHash]) {
            //         // orderIdState.id = 200
            //         setOrderId({ id: +orderIdFromHash })
            //         console.log(orderIdState)
            //     } else {
            //         setOrderId({ id: -1 })
            //     }
            //     // let productRespons = await getProduct(id)
            //     // setProduct(productRespons[0])
            //     // if (productRespons.length > 1) {
            //     //     alert('ОШИБКА ПРИ ПОЛУЧЕНИИ ДАННЫХ О ПРОДУКТЕ!')
            //     // }
            // }
            // }
        }

        console.log('заказы отрендерены')
        document.addEventListener('beforePopupOpen', getOrderId);

        return () => {
            document.removeEventListener('beforePopupOpen', getOrderId);
        };
    }, []);

    return <>
        <div data-order-id={0} id={process.env.NEXT_PUBLIC_POPUP_ORDER_HASH} aria-hidden="true" className="popup popup-window">
            <div className="popup__wrapper">
                <div className="popup__content">
                    <button data-close="data-close" type="button" className="popup__close">
                        <img src="/Common/CrossWhite.svg" alt="Cross" />
                    </button>
                    <form onSubmit={onSubmit} method="POST" className="popup-order">
                        {orderIdState === 0 ? <div className="error"><span className="error__code">заказ не выбран</span></div> :
                            (!ordersDetailsState[orderIdState] ? <div className="error"><span className="error__code">этот заказ вам не доступен</span></div> :
                                (<>
                                    <div className="popup__header popup__header">
                                        <h2 className="popup__title popup__title">Заказ №{orderIdState}</h2>
                                    </div>
                                    <div className="popup-order__data">
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Статус:</h3>
                                            {!isAdminState ?
                                                <div className="popup-order__data-value">{ordersState[orderIdState].status}</div> :
                                                <OrderSelect name={'status'} statusArray={['готовится', 'доставляется', 'доставлено', 'отменено']} status={ordersState[orderIdState].status} id={1} />}
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Доставка:</h3>
                                            <div className="popup-order__data-value">{ordersState[orderIdState].delivery}</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Дата:</h3>
                                            <div className="popup-order__data-value">{ordersState[orderIdState].order_date_time.toLocaleDateString()}</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Время:</h3>
                                            <div className="popup-order__data-value">{ordersState[orderIdState].order_date_time.toLocaleTimeString()}</div>
                                        </div>
                                        <div className="popup-order__data-block">

                                            <h3 className="popup-order__data-title">Оплачено:</h3>
                                            {!isAdminState ?
                                                <div className="popup-order__data-value">{ordersState[orderIdState].payment}</div> :
                                                <OrderSelect name={'payment'} statusArray={['оплачено', 'нужно оплатить']} status={ordersState[orderIdState].payment} id={2} />}
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Общая цена:</h3>
                                            <div className="popup-order__data-value">{getOrderPrice(ordersDetailsState[orderIdState])} ₴</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Продукты:</h3>
                                            <div className="popup-order__data-value popup-order__data-value_product">
                                                <div className="popup-window__inner popup-window__inner_product">
                                                    {
                                                        ordersDetailsState[orderIdState].map((item, num) => {
                                                            console.log('перерендер')
                                                            uniqueCartItemKey++
                                                            return (
                                                                <CartItem key={uniqueCartItemKey} productData={item} number={num} lock={true} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>)
                            )
                        }
                        {isAdminState ? <input type="submit" /> : <></>}
                    </form>
                </div>
            </div>
        </div>
    </>
}

function getOrderPrice(orderProductsData) {
    let sum = 0;
    for (let i = 0; i < orderProductsData.length; i++) {
        sum += parseFloat(orderProductsData[i].selled_price) * orderProductsData[i].quantity;
    }
    return sum;
}