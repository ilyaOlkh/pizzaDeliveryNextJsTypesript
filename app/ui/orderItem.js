import { setParam } from "../service/setSearchParam";

export default function OrderItem({ orderData, orderProductsData }) {
    return <button type="button" onClick={() => { setParam(process.env.NEXT_PUBLIC_ID_FOR_ORDER, orderData.order_id) }} data-popup={"#" + process.env.NEXT_PUBLIC_POPUP_ORDER_HASH} className="order">
        <div className={"order__row " + (orderData.status == 'готується' ? "order__row_red " : (orderData.status == 'доставляється' ? "order__row_orange " : ""))}>
            <div className="order__info">
                <div className="order__info-title">
                    Замовлення
                </div>
                <div className="order__info-value">
                    №{orderData.order_id}
                </div>
            </div>
            {orderData.first_name ?
                <div className="order__info">
                    <div className="order__info-title">
                        Замовник
                    </div>
                    <div className="order__info-value">
                        {orderData.first_name + ' ' + orderData.last_name}
                    </div>
                </div> :
                <></>
            }
            <div className="order__info">
                <div className="order__info-title">
                    Дата та час
                </div>
                <div className="order__info-value">
                    {orderData.order_date_time.toLocaleString()}
                </div>
            </div>
            <div className="order__info">
                <div className="order__info-title">
                    Сума замовлення
                </div>
                <div className="order__info-value">
                    {getOrderPrice(orderProductsData)} ₴
                </div>
            </div>
            <div className="order__info">
                <div className="order__info-title">
                    Статус
                </div>
                <div className="order__info-value">
                    {orderData.status}
                </div>
            </div>
            <div className="order__info">
                <div className="order__info-title">
                    Оплачено
                </div>
                <div className="order__info-value">
                    {orderData.payment}
                </div>
            </div>
            <div className="order__info">
                <div className="order__info-title">
                    Доставка
                </div>
                <div className="order__info-value">
                    {orderData.delivery}
                </div>
            </div>
        </div>
        <div className="order__row">
            <div className="order__images">
                {orderProductsData?.map(item => <div className={"order__image" + (item.hidden ? " order__image_hidden" : '')}>
                    <img src={item.image_url.slice(3)} />
                    <span>{item.quantity}</span>
                </div>)
                }
            </div>
        </div>
    </button >
}

function getOrderPrice(orderProductsData) {
    let sum = 0;
    if (orderProductsData) {
        for (let i = 0; i < orderProductsData.length; i++) {
            if (orderProductsData[i].hidden) continue
            sum += parseFloat(orderProductsData[i].selled_price) * orderProductsData[i].quantity;
        }
    }
    return sum;
}