'use server'
import { GetUserInfoForServer } from "../AuthControllers/GetDataController";
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';


export async function deleteOrderDetails(arr: number[]): Promise<"Order updated successfully" | "нет изменений" | "no access" | "error"> {
    try {
        const pool = new Pool({
            connectionString: process.env.POSTGRES_URL
        });

        const db = new Kysely<Database>({
            dialect: new PostgresDialect({ pool }),
        });

        let userData = await GetUserInfoForServer()
        if (userData[3]) {
            if (arr.length > 0) {
                await db.deleteFrom('orderdetails')
                    .where('order_details_id', 'in', arr)
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
        return "error"
    }
}