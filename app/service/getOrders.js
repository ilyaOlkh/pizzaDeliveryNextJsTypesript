'use server'

import { GetUserInfoForServer, checkIsAdmin } from "../AuthControllers/GetDataController"
import { getUserCookies } from "../AuthControllers/GetDataController"
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export async function getOrders(page, numInPage, all = false, sort, filters) {
    let userData;
    let isAdmin = false;
    let querytextGlobal = ``

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

            if (filters) {
                for (const value in filters) {
                    const ingredients = filters[value].split(",").map((elem) => `'${elem}'`);
                    let querytext = ''
                    ingredients.forEach(element => {
                        querytext += element + ', '
                    });
                    querytext = querytext.slice(0, -2);
                    querytextGlobal += ` ${value} in (${querytext}) AND `
                }
                querytextGlobal = querytextGlobal.slice(0, -4);

                console.log(querytextGlobal)

            }

            if (!isAdmin && userData) {
                query = query.where(sql(`${querytextGlobal}order_.customer_id = ${userData.customer_id}`));
            } else if (filters) {

                console.log(querytextGlobal)

                query = query.where(sql(`${querytextGlobal}`))
            }

            if (sort) {
                query = query.orderBy(sql(sort.sortRule), sort.direction)
                query = query.groupBy(sql("order_.order_id, customer.first_name, customer.last_name"))
            } else {
                query = query.orderBy('order_date_time', 'desc')
            }
            if (page && numInPage) {
                query = query.limit(numInPage).offset((page - 1) * numInPage)
            }
            let result = await query.execute()
            return result

        } catch (error) {
            console.log({ error: `1Помилка: ${error.message}` })
            setTimeout(() => { console.log({ error: `1Помилка: ${error.message}` }) }, 3000)
            return 'error'
        }
    }
}