'use server'

import { GetUserInfoForServer, checkIsAdmin } from "../AuthControllers/GetDataController"
import { getUserCookies } from "../AuthControllers/GetDataController"
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export async function getOrder(id) {
    let userData;

    userData = await GetUserInfoForServer()
    let isAdmin = userData[2]
    console.log(isAdmin)
    if (userData[0]) {
        userData = userData[1]
        try {
            const db = createKysely({ connectionString: process.env.POSTGRES_URL });
            let query = db.selectFrom('order_')
                .leftJoin('customer', 'order_.customer_id', 'customer.customer_id')
                .select([
                    'order_.order_id',
                    // 'order_.customer_id',
                    'order_.order_date_time',
                    'order_.status',
                    'order_.payment',
                    'order_.delivery',
                    'customer.first_name',
                    'customer.last_name',
                    'customer.street',
                    'customer.house',
                    'customer.entrance',
                    'customer.floor',
                    'customer.apartment',
                    'customer.intercom_code',
                    'customer.phone',
                ])

            let whereArr = []
            if (userData) {
                if (!isAdmin) {
                    whereArr.push(`order_.customer_id = ${userData.customer_id}`)
                }
            } else {
                return 'no log in'
            }
            if (id) {
                whereArr.push(`order_.order_id = ${id}`)
            } else {
                return 'no access'
            }
            query = query.where(sql(`${whereArr.join(' AND ')}`));

            let result = await query.executeTakeFirst()
            return result

        } catch (error) {
            console.log({ error: `1.5Помилка: ${error.message}` })
            return 'error'
        }
    }
}