'use client'
import { useContext, useState, useEffect } from "react"
import { OrdersContext, OrdersDetailsContext } from "../context/contextProvider"
import CartItem from "../ui/CartItem"

const orderHash = '#' + process.env.NEXT_PUBLIC_POPUP_ORDER_HASH

export default function PopupOrder() {
    const { ordersState, setOrders } = useContext(OrdersContext)
    const { ordersDetailsState, setOrdersDetails } = useContext(OrdersDetailsContext)
    const [orderIdState, setOrderId] = useState({ id: 0 })
    console.log(ordersState, ordersDetailsState)

    let uniqueCartItemKey = 0



    useEffect(() => {

        function getOrderId(e) {
            if (e.detail.popup.hash == orderHash) {
                let search = window.location.search
                const params = new URLSearchParams(search)
                const orderIdFromHash = params.get(process.env.NEXT_PUBLIC_ID_FOR_ORDER)
                setOrderId({ id: +orderIdFromHash })
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
                    <div className="popup-order">
                        {orderIdState.id === 0 ? <div className="error"><span className="error__code">заказ не выбран</span></div> :
                            (!ordersDetailsState[orderIdState.id] ? <div className="error"><span className="error__code">этот заказ вам не доступен</span></div> :
                                (<>
                                    <div className="popup__header popup__header">
                                        <h2 className="popup__title popup__title">Заказ №{orderIdState.id}</h2>
                                    </div>
                                    <div className="popup-order__data">
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Статус:</h3>
                                            <div className="popup-order__data-value">{ordersState[orderIdState.id].status}</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Доставка:</h3>
                                            <div className="popup-order__data-value">{ordersState[orderIdState.id].delivery}</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Дата:</h3>
                                            <div className="popup-order__data-value">{ordersState[orderIdState.id].order_date_time.toLocaleDateString()}</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Время:</h3>
                                            <div className="popup-order__data-value">{ordersState[orderIdState.id].order_date_time.toLocaleTimeString()}</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Оплачено:</h3>
                                            <div className="popup-order__data-value">{ordersState[orderIdState.id].payment}</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Общая цена:</h3>
                                            <div className="popup-order__data-value">{getOrderPrice(ordersDetailsState[orderIdState.id])} ₴</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Продукты:</h3>
                                            <div className="popup-order__data-value popup-order__data-value_product">
                                                <div className="popup-window__inner popup-window__inner_product">
                                                    {
                                                        ordersDetailsState[orderIdState.id].map((item, num) => {
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
                    </div>
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