'use client'
import { useContext, useState, useEffect, useRef } from "react"
import { MyContext, OrdersContext, OrdersDetailsContext, isAdminContext } from "../context/contextProvider"
import CartItem from "../ui/CartItem"
import OrderSelect from "./OrderSelect"
import { updateOrder } from "../service/updateOrder"

import { show, hide } from "./loading"


const orderHash = '#' + process.env.NEXT_PUBLIC_POPUP_ORDER_HASH

export default function PopupOrder() {
    const { ordersState, setOrders } = useContext(OrdersContext)
    const { ordersDetailsState, setOrdersDetails } = useContext(OrdersDetailsContext)
    const { isAdminState, setIsAdmin } = useContext(isAdminContext)
    const [isOpen, setIsOpen] = useState(false)
    const [thisOrderState, setThisOrder] = useState({})
    let uniqueCartItemKey = 0

    console.log(thisOrderState)

    async function onSubmit(event) {
        show()
        event.preventDefault()
        if (isAdminState) {
            let Changes = {}
            const formData = new FormData(event.target);
            const formObj = Object.fromEntries(formData.entries())
            const keys = Object.keys(formObj)
            const thisOrder = thisOrderState.thisOrder
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
                res = await updateOrder(Changes, thisOrderState.order_id)
            }
            if (res == 'no access') {
                setIsAdmin(false)
                alert('отказано в доступе!')
            }
            if (res == 'Order updated successfully') {
                let newOrdersState = { ...ordersState }
                Object.entries(Changes).forEach(([key, value]) => {
                    newOrdersState[thisOrderState.index][key] = value
                })
                setOrders(newOrdersState)
            }
            console.log(res, ordersState)
        }
        hide()
    }
    useEffect(() => {
        if (isOpen) {
            let search = window.location.search
            const params = new URLSearchParams(search)
            const orderId = +params.get(process.env.NEXT_PUBLIC_ID_FOR_ORDER)
            const index = findById(orderId, ordersState)
            setThisOrder({
                index: index,
                order_id: orderId,
                thisOrder: ordersState[index],
                thisOrderDetails: ordersDetailsState[orderId]
            })
        }
    }, [isOpen])

    useEffect(() => {
        function open(e) {
            if (e.detail.popup.hash == orderHash) {
                setIsOpen(true)
            }
        }
        function close(e) {
            if (e.detail.popup.hash == orderHash) {
                setIsOpen(false)
            }
        }


        console.log('заказы отрендерены')
        document.addEventListener('beforePopupOpen', open);
        document.addEventListener('afterPopupClose', close);

        return () => {
            document.removeEventListener('beforePopupOpen', open);
            document.removeEventListener('afterPopupClose', close);
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
                        {Object.keys(thisOrderState).length === 0 ? <div className="error"><span className="error__code">заказ не выбран</span></div> :
                            (!thisOrderState.thisOrderDetails ? <div className="error"><span className="error__code">этот заказ вам не доступен</span></div> :
                                (<>
                                    <div className="popup__header popup__header">
                                        <h2 className="popup__title popup__title">Заказ №{thisOrderState.order_id}</h2>
                                    </div>
                                    <div className="popup-order__data">
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Статус:</h3>
                                            {!isAdminState ?
                                                <div className="popup-order__data-value">{thisOrderState.thisOrder.status}</div> :
                                                <OrderSelect name={'status'} statusArray={['готовится', 'доставляется', 'доставлено', 'отменено']} status={thisOrderState.thisOrder.status} id={1} />}
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Доставка:</h3>
                                            <div className="popup-order__data-value">{thisOrderState.thisOrder.delivery}</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Дата:</h3>
                                            <div className="popup-order__data-value">{thisOrderState.thisOrder.order_date_time.toLocaleDateString()}</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Время:</h3>
                                            <div className="popup-order__data-value">{thisOrderState.thisOrder.order_date_time.toLocaleTimeString()}</div>
                                        </div>
                                        <div className="popup-order__data-block">

                                            <h3 className="popup-order__data-title">Оплачено:</h3>
                                            {!isAdminState ?
                                                <div className="popup-order__data-value">{thisOrderState.thisOrder.payment}</div> :
                                                <OrderSelect name={'payment'} statusArray={['оплачено', 'нужно оплатить']} status={thisOrderState.thisOrder.payment} id={2} />}
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Общая цена:</h3>
                                            <div className="popup-order__data-value">{getOrderPrice(thisOrderState.thisOrderDetails)} ₴</div>
                                        </div>
                                        <div className="popup-order__data-block">
                                            <h3 className="popup-order__data-title">Продукты:</h3>
                                            <div className="popup-order__data-value popup-order__data-value_product">
                                                <div className="popup-window__inner popup-window__inner_product">
                                                    {
                                                        thisOrderState.thisOrderDetails.map((item, num) => {
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
                        {isAdminState ? <div className="popup-from-left__buttons"><button className="popup-from-left__button" type="submit"> Отправить</button></div> : <></>}
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

function findById(id, ordersState) {
    console.log(ordersState)
    for (let item in ordersState) {
        if (ordersState[item].order_id == id) {
            console.log(ordersState[item])
            return +item
        }
    }
    return false
}