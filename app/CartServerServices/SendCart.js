'use server'
import { createKysely } from '@vercel/postgres-kysely';

export default async function insertOrder(delivery, worker_id, customer_id, cartItems) {
    console.log('старт вставки заказа')
    let OrderId;
    try {
        const db = createKysely({ connectionString: process.env.POSTGRES_URL });
        OrderId = await db.insertInto('order_').values({
            customer_id: customer_id,
            worker_id: worker_id,
            order_date_time: new Date(),
            status: 'готовится',
            payment: 'нужно оплатить',
            delivery: delivery,
        }).returning('order_id').executeTakeFirst()
    } catch (error) {
        console.log({ error: `Ошибка при вставке данных: ${error.message}` })
        return 'error'
    }
    console.log('старт вставки товаров')
    if (OrderId) {
        try {

            insertOrderDetails(OrderId.order_id, cartItems)
        } catch (error) {
            console.log({ error: `Ошибка при вставке данных: ${error.message}` })
            return 'error'
        }
    } else {
        console.log('нет айдишника')
        return 'error'
    }
    return 'success'
}

async function insertOrderDetails(OrderId, cartItems) {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });
    const orderDetailsArray = cartItems.map(item => ({
        order_id: +OrderId,
        pizzadetails_id: item.id,
        dough: item.dough,
        quantity: item.quantity,
        selled_price: item.selled_price
    }))

    await db.insertInto('orderdetails').values(orderDetailsArray).execute()

}