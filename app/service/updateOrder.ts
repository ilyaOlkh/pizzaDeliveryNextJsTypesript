'use server'

import { GetUserInfoForServer } from '../AuthControllers/GetDataController';
import { IChanges } from "../types/order"
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';



export async function updateOrder(changes: IChanges, order_id: number) {
    try {
        const pool = new Pool({
            connectionString: process.env.POSTGRES_URL
        });

        const db = new Kysely<Database>({
            dialect: new PostgresDialect({ pool }),
        });
        let userData = await GetUserInfoForServer()
        if (userData[3]) {
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
        return 'error'
    }

}