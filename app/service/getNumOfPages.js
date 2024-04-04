'use server'

import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'


export async function getNumOfPages(userId) {
    try {
        const db = createKysely({ connectionString: process.env.POSTGRES_URL });
        let query = db.selectFrom('order_')
            .select([
                sql('count(order_.order_id)'),
                // 'order_.customer_id',
                // 'order_.order_date_time',
                // 'order_.status',
                // 'order_.payment',
                // 'order_.delivery',
            ])
        if (userId) {
            query = query.where(sql(`order_.customer_id = ${userId}`));
        }
        return await query.executeTakeFirst()
    } catch (error) {
        console.log({ error: `Ошибка: ${error.message}` })
        return 'error'
    }
}