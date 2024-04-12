'use server'

import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'


export async function getNumOfPages(userId, filters) {
    let querytextGlobal = ``
    try {
        const db = createKysely({ connectionString: process.env.POSTGRES_URL });
        let query = db.selectFrom('order_')
            .select([
                sql('count(order_.order_id)'),
            ])

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
            console.log(1, querytextGlobal)
        }
        console.log(1, querytextGlobal)
        console.log(1, querytextGlobal)

        if (userId) {

            query = query.where(sql(`${querytextGlobal}order_.customer_id = ${userId}`));
        } else if (filters) {

            querytextGlobal = querytextGlobal.slice(0, -4);

            query = query.where(sql(`${querytextGlobal}`))
        }
        return await query.executeTakeFirst()
    } catch (error) {
        console.log({ error: `3помилка: ${error.message}` })
        return 'error'
    }
}