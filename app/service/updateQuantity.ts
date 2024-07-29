'use server'
import { GetUserInfoForServer } from "../AuthControllers/GetDataController";
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';


export async function updateQuantity(obj: Record<number, number>) {
    try {
        const pool = new Pool({
            connectionString: process.env.POSTGRES_URL
        });

        const db = new Kysely<Database>({
            dialect: new PostgresDialect({ pool }),
        });
        let userData = await GetUserInfoForServer()
        if (userData[3]) {
            if (Object.keys(obj).length > 0) {
                let command = ' CASE'
                Object.entries(obj).forEach(([id, value]) => { command += ` WHEN order_details_id = ${id} THEN ${value} ` })
                command += ' ELSE quantity END'
                await db.updateTable('orderdetails')
                    .set({
                        quantity: sql.raw(`${command}`)
                    })
                    .where('order_details_id', 'in', Object.keys(obj).map(value => +value))
                    .execute()
                return 'Order updated successfully';
            } else {
                return 'нет изменений'
            }
        } else {
            return 'no access'
        }
    } catch (e) {
        console.log('1Помилка', e)
        return 'error'
    }
}