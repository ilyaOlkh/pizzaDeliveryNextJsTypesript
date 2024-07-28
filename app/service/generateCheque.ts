
import { IOrder, IOrderData } from '../types/order';
import { getOrder } from './getOrder';
import getOrdersProductsByIDs from './getOrdersProductsByIDs';

export default async function generateCheque(thisOrder: IOrderData, id: undefined): Promise<{ text: string; fontSize?: number; }[]>
export default async function generateCheque(thisOrder: undefined, id: number): Promise<{ text: string; fontSize?: number; }[]>
export default async function generateCheque(thisOrder?: IOrderData, id?: number): Promise<{
    text: string;
    fontSize?: number;
}[]> {
    let thisOrderState: Omit<IOrderData, 'index'>
    if (thisOrder) {
        thisOrderState = thisOrder
    } else if (id) {
        let order: "error" | "no access" | "no log in" | undefined | IOrder = await getOrder(id)
        if (order && order !== 'no log in' && order !== 'no access' && order !== 'error') {
            thisOrderState = {
                order_id: id,
                thisOrder: order,
                thisOrderDetails: (await getOrdersProductsByIDs([id]))[id]
            }
        } else {
            console.log("Отказано по причине: ", order)
            return []
        }

    } else {
        console.log("нет никаких данных про заказ")
        return []
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
                    Дата: ${new Date(thisOrderState.thisOrder.order_date_time).toLocaleDateString()}
                    Час: ${new Date(thisOrderState.thisOrder.order_date_time).toLocaleTimeString()}
                    Оплачено: ${thisOrderState.thisOrder.payment}
                    Загальна ціна: ${getOrderPrice(thisOrderState.thisOrderDetails)} грн
                    Замовник: ${thisOrderState.thisOrder.first_name + ' ' + thisOrderState.thisOrder.last_name}
                    Телефонний номер замовника: ${thisOrderState.thisOrder.phone}`,
        })
        if (thisOrderState.thisOrder?.delivery == 'доставка') {
            reaArray.push({
                text: `Адреса ${thisOrderState.thisOrder.street ? `вулиця ${thisOrderState.thisOrder.street}` : ""}${thisOrderState.thisOrder.house ? `, будинок ${thisOrderState.thisOrder.house}` : ""}${thisOrderState.thisOrder.entrance ? `, під'їзд ${thisOrderState.thisOrder.entrance}` : ""}${thisOrderState.thisOrder.floor ? `, поверх ${thisOrderState.thisOrder.entrance}` : ""}${thisOrderState.thisOrder.apartment ? `, квартира ${thisOrderState.thisOrder.apartment}` : ""}${thisOrderState.thisOrder.intercom_code ? `, код від домофону ${thisOrderState.thisOrder.intercom_code}` : ""}`,
            })
        }
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

function getOrderPrice(orderProductsData: IOrderData['thisOrderDetails']) {
    let sum = 0;
    for (let i = 0; i < orderProductsData?.length; i++) {
        if (orderProductsData[i].hidden) continue
        sum += orderProductsData[i].selled_price * orderProductsData[i].quantity;
    }
    return sum;
}