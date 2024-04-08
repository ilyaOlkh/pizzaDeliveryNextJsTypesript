'use server'

import { GetUserInfoForServer, checkIsAdmin } from "../AuthControllers/GetDataController"
import { getUserCookies } from "../AuthControllers/GetDataController"
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export async function getOrders(page, numInPage, all = false, sort) {
    let userData;
    let isAdmin = false;
    if (!all) {
        userData = await getUserCookies()
    } else {
        userData = await GetUserInfoForServer()
    }

    if (all) {
        isAdmin = userData[2]
        if (!isAdmin) {
            return 'no access'
        }
    }

    if (userData[0]) {
        userData = userData[1]



        try {
            const db = createKysely({ connectionString: process.env.POSTGRES_URL });

            let query = db.selectFrom('order_')
            if (isAdmin) {
                query = query.leftJoin('customer', 'order_.customer_id', 'customer.customer_id')
            }
            if (sort) {
                query = query.leftJoin('orderdetails', 'order_.order_id', 'orderdetails.order_id')
            }
            query = query.select([
                'order_.order_id',
                // 'order_.customer_id',
                'order_.order_date_time',
                'order_.status',
                'order_.payment',
                'order_.delivery',
                (isAdmin ? 'customer.first_name' : null),
                (isAdmin ? 'customer.last_name' : null),
            ].filter(Boolean))
            if (!isAdmin) {
                if (userData) {
                    query = query.where(sql(`order_.customer_id = ${userData.customer_id}`));
                }
            }
            if (sort) {
                query = query.orderBy(sql(sort.sortRule), sort.direction)
                query = query.groupBy(sql("order_.order_id, customer.first_name, customer.last_name"))
            }
            if (page && numInPage) {
                query = query.limit(numInPage).offset((page - 1) * numInPage)
            }
            let result = await query.execute()
            // let groupedOrders = result.reduce((acc, cur) => {
            //     acc[cur.order_id] = cur;
            //     return acc;
            // }, {});
            // return groupedOrders
            return result

        } catch (error) {
            console.log({ error: `Ошибка: ${error.message}` })
            setTimeout(() => { console.log({ error: `Ошибка: ${error.message}` }) }, 3000)
            return 'error'
        }
    }
}