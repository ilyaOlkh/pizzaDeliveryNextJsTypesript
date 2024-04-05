'use server'

import { GetUserInfoForServer, checkIsAdmin } from "../AuthControllers/GetDataController"
import { getUserCookies } from "../AuthControllers/GetDataController"
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export async function getOrders(page, numInPage, all = false) {
    let userData;
    let isAdmin = false;
    if (!all) {
        userData = await getUserCookies()
    } else {
        userData = await GetUserInfoForServer()
    }
    if (userData[0]) {
        userData = userData[1]

        if (all) {
            isAdmin = await checkIsAdmin(userData.customer_id)
        }

        try {
            const db = createKysely({ connectionString: process.env.POSTGRES_URL });

            let query = db.selectFrom('order_')
            if (isAdmin) {
                query = query.leftJoin('customer', 'order_.customer_id', 'customer.customer_id')
            }
            query = query.select([
                'order_.order_id',
                // 'order_.customer_id',
                'order_.order_date_time',
                'order_.status',
                'order_.payment',
                'order_.delivery',
                (isAdmin ? 'customer.first_name' : ''),
                (isAdmin ? 'customer.last_name' : ''),
            ])
            if (!isAdmin) {
                if (userData) {
                    query = query.where(sql(`order_.customer_id = ${userData.customer_id}`));
                }
            }
            if (page && numInPage) {
                query = query.limit(numInPage).offset((page - 1) * numInPage)
            }
            let result = await query.execute()
            let groupedOrders = result.reduce((acc, cur) => {
                acc[cur.order_id] = cur;
                return acc;
            }, {});
            return groupedOrders

        } catch (error) {
            console.log({ error: `Ошибка: ${error.message}` })
            return 'error'
        }
    }
}