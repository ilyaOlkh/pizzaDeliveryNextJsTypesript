export default function OrderItem({ orderData, orderProductsData }) {

    return <div className="order">
        <div className={"order__row " + (orderData.status == 'готовится' ? "order__row_red " : (orderData.status == 'доставляется' ? "order__row_orange " : ""))}>
            <div className="order__info">
                <div className="order__info-title">
                    Заказ
                </div>
                <div className="order__info-value">
                    №{orderData.order_id}
                </div>
            </div>
            <div className="order__info">
                <div className="order__info-title">
                    Сумма заказа
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
                {orderProductsData.map(item => <div className="order__image">
                    <img src={item.image_url.slice(3)} />
                    <span>{item.quantity}</span>
                </div>)
                }
            </div>
        </div>
    </div >
}

function getOrderPrice(orderProductsData) {
    // alert(JSON.stringify(orderProductsData))
    let sum = 0;
    for (let i = 0; i < orderProductsData.length; i++) {
        sum += parseFloat(orderProductsData[i].selled_price) * orderProductsData[i].quantity;
    }
    return sum;
}