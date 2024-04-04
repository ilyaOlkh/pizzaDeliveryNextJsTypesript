'use server'

import { GetUserInfoForServer } from "../AuthControllers/GetDataController"
import { getUserCookies } from "../AuthControllers/GetDataController"
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export async function getOrders(page, numInPage) {
    console.log('--------------------------------', page, numInPage)
    // let userData = await GetUserInfoForServer()
    let userData = await getUserCookies()
    if (userData[0]) {
        userData = userData[1]

        console.log(userData)
        try {
            const db = createKysely({ connectionString: process.env.POSTGRES_URL });

            let query = db.selectFrom('order_')
                .select([
                    'order_.order_id',
                    // 'order_.customer_id',
                    'order_.order_date_time',
                    'order_.status',
                    'order_.payment',
                    'order_.delivery',
                ])
            if (userData) {
                query = query.where(sql(`order_.customer_id = ${userData.customer_id}`));
            }
            if (page && numInPage) {
                query = query.limit(numInPage).offset((page - 1) * numInPage)
            }
            return await query.execute()

        } catch (error) {
            console.log({ error: `Ошибка: ${error.message}` })
            return 'error'
        }
    }
}