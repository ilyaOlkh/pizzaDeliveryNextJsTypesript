'use server'
import { createKysely } from '@vercel/postgres-kysely';

export default async function insertOrder(delivery, worker_id, customer_id, cartItems) {
    let OrderId;
    try {
        const db = createKysely({ connectionString: process.env.POSTGRES_URL });
        OrderId = await db.insertInto('order_').values({
            customer_id: customer_id,
            worker_id: worker_id,
            order_date_time: new Date(),
            status: 'готується',
            payment: 'потрібно оплатити',
            delivery: delivery,
        }).returning('order_id').executeTakeFirst()
    } catch (error) {
        console.log({ error: `Помилка при вставці даних: ${error.message}` })
        return ['error']
    }
    if (OrderId) {
        try {

            insertOrderDetails(OrderId.order_id, cartItems)
        } catch (error) {
            console.log({ error: `Помилка при вставці даних: ${error.message}` })
            return ['error']
        }
    } else {
        console.log('немає айдішника')
        return ['error']
    }
    return ['success', OrderId.order_id]
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