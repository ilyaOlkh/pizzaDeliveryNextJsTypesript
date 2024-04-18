'use server'
import { sql } from 'kysely'
import { GetUserInfoForServer } from "../AuthControllers/GetDataController";
import { createKysely } from '@vercel/postgres-kysely';


export async function updateQuantity(obj) {

    try {
        const db = createKysely({ connectionString: process.env.POSTGRES_URL });
        let userData = await GetUserInfoForServer()
        if (userData[2]) {
            if (Object.keys(obj).length > 0) {
                let command = ' CASE'
                Object.entries(obj).forEach(([id, value]) => { console.log([id, value]); command += ` WHEN order_details_id = ${id} THEN ${value} ` })
                command += ' ELSE quantity END'
                console.log(command)
                await db.updateTable('orderdetails')
                    .set({
                        quantity: sql.raw(`${command}`)
                    })
                    .where('order_details_id', 'in', Object.keys(obj))
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
    }
}