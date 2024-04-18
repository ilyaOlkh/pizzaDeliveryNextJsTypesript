'use server'
import { GetUserInfoForServer } from "../AuthControllers/GetDataController";
import { createKysely } from '@vercel/postgres-kysely';


export async function deleteOrderDetails(arr) {
    try {
        const db = createKysely({ connectionString: process.env.POSTGRES_URL });
        let userData = await GetUserInfoForServer()
        if (userData[2]) {
            if (arr.length > 0) {
                console.log(arr)

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
    }
}