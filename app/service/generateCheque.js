
import { getOrder } from '../service/getOrder';
import getOrdersProductsByIDs from '../service/getOrdersProductsByIDs';
import OrderDetailsItem from '../ui/OrderDetailsItem';


// import { usePDF } from 'react-to-pdf';

export default async function generateCheque(thisOrder, id) {
    const thisOrderState = thisOrder || {
        order_id: id,
        thisOrder: await getOrder(id),
        thisOrderDetails: (await getOrdersProductsByIDs([id]))[id]
    }

    let reaArray = []
    if (Object.keys(thisOrderState).length === 0) {
        reaArray.push({ text: 'замовлення не обрано' })
    } else if (!thisOrderState.thisOrder && thisOrderState.order_id) {
        reaArray.push({ text: 'немає доступу' })
    } else {
        reaArray.push({ text: `Замовлення №${thisOrderState.order_id}`, fontSize: 24 })
        reaArray.push({
            text: `Статус: ${thisOrderState.thisOrder.status}
                    Доставка: ${thisOrderState.thisOrder.delivery}
                    Дата: ${thisOrderState.thisOrder.order_date_time.toLocaleDateString()}
                    Час: ${thisOrderState.thisOrder.order_date_time.toLocaleTimeString()}
                    Оплачено: ${thisOrderState.thisOrder.payment}
                    Загальна ціна: ${getOrderPrice(thisOrderState.thisOrderDetails)} грн
                    Замовник: ${thisOrderState.thisOrder.first_name + ' ' + thisOrderState.thisOrder.last_name}`,
        })
        if (thisOrderState.thisOrderDetails) {
            reaArray.push({ text: 'Продукти:' })
            thisOrderState.thisOrderDetails.forEach((item, num) => {
                reaArray.push({ text: `Назва: ${item.p_name}`, margin: [10, 0, 0, 0] })
                reaArray.push({
                    text: (`Ціна: ${item.selled_price} грн` +
                        `\nКількість: ${item.quantity} шт.` +
                        (item.size_cm ? `\nРозмір: ${item.size_cm} см` : '') +
                        (item.dough ? `\nТісто: ${item.dough}` : '') +
                        (item.weight_g ? `\nВага: ${item.weight_g} г` : '')
                    ),
                    margin: [20, 0, 0, 0]
                })
            })
        } else {
            reaArray.push({ text: 'Продукти: немає' })
        }
    }

    return reaArray
}

function getOrderPrice(orderProductsData) {
    let sum = 0;
    for (let i = 0; i < orderProductsData?.length; i++) {
        if (orderProductsData[i].hidden) continue
        sum += parseFloat(orderProductsData[i].selled_price) * orderProductsData[i].quantity;
    }
    return sum;
}

function findById(id, ordersState) {
    for (let item in ordersState) {
        if (ordersState[item].order_id == id) {
            return +item
        }
    }
    return false
}