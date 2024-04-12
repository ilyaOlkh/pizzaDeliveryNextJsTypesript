'use server'

import { createKysely } from '@vercel/postgres-kysely';
import { GetUserInfoForServer } from '../AuthControllers/GetDataController';

export async function updateOrder(changes, order_id) {
    try {
        const db = createKysely({ connectionString: process.env.POSTGRES_URL });
        let userData = await GetUserInfoForServer()
        if (userData[2]) {
            if (Object.keys(changes).length > 0) {
                await db.updateTable('order_').set(changes).where('order_id', '=', order_id).execute();
                return 'Order updated successfully';
            } else {
                return 'нет изменений'
            }
        } else {
            return 'no access'
        }
    } catch (e) {
        console.log('Помилка', e)
    }

}