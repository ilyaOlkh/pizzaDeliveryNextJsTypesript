'use server'

import { GetUserInfoForServer } from "../AuthControllers/GetDataController"
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from '@/app/types/databaseSchema';

export async function getOrder(id: number) {
    let userData;

    userData = await GetUserInfoForServer()
    let isAdmin = userData[3]
    if (userData[0]) {
        userData = userData[2]
        try {
            const pool = new Pool({
                connectionString: process.env.POSTGRES_URL
            });

            const db = new Kysely<Database>({
                dialect: new PostgresDialect({ pool }),
            });
            let query = db.selectFrom('order_')
                .innerJoin('customer', 'order_.customer_id', 'customer.customer_id')
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

            if (userData) {
                if (!isAdmin) {
                    query = query.where('order_.customer_id', '=', userData.customer_id)
                }
            } else {
                return 'no log in'
            }
            query = query.where('order_.order_id', '=', id)

            let result = await query.executeTakeFirst()
            return result

        } catch (error) {
            console.log(`1.5Помилка: ${error}`)
            return 'error'
        }
    } else {
        return 'no access'
    }
}