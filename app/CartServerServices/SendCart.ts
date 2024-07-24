'use server'
import { createKysely } from '@vercel/postgres-kysely';
import { TypeCart } from '../types/cart';
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { DatabaseInsert } from '../types/databaseSchema';

type TypeOrderResponce = [message: 'error'] | [message: 'success', order_id: number]

export default async function insertOrder(
    delivery: DatabaseInsert["order_"]["delivery"],
    worker_id: DatabaseInsert["order_"]["worker_id"],
    customer_id: DatabaseInsert["order_"]["customer_id"],
    cartItems: TypeCart): Promise<TypeOrderResponce> {

    let OrderId: { order_id: number | undefined } | undefined;
    try {
        const pool = new Pool({
            connectionString: process.env.POSTGRES_URL
        });

        const db = new Kysely<DatabaseInsert>({
            dialect: new PostgresDialect({ pool }),
        });

        OrderId = await db.insertInto('order_').values({
            customer_id: customer_id,
            worker_id: worker_id,
            order_date_time: new Date().toString(),
            status: 'готується',
            payment: 'потрібно оплатити',
            delivery: delivery,
        }).returning('order_id').executeTakeFirst()

    } catch (error) {
        console.log(`Помилка при вставці даних: ${error}`)
        return ['error']
    }
    if (OrderId && OrderId.order_id) {
        if (cartItems.length > 0) {
            try {
                insertOrderDetails(OrderId.order_id, cartItems)
                return ['success', OrderId.order_id]
            } catch (error) {
                console.log(`Помилка при вставці даних: ${error}`)
                return ['error']
            }
        } else {
            console.log('немає товарів в корзині')
            return ['error']
        }
    } else {
        console.log('немає айдішника')
        return ['error']
    }
}

async function insertOrderDetails(OrderId: number, cartItems: TypeCart): Promise<void> {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<DatabaseInsert>({
        dialect: new PostgresDialect({ pool }),
    });

    const orderDetailsArray = cartItems.map(item => ({
        order_id: OrderId,
        pizzadetails_id: item.id,
        dough: item.dough,
        quantity: item.quantity,
        selled_price: item.selled_price
    }))

    await db.insertInto('orderdetails').values(orderDetailsArray).execute()

}