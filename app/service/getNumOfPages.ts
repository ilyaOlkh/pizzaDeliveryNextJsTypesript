'use server'

import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { TypeFilters } from "@/app/types/types"
import { Database } from '@/app/types/databaseSchema';


export async function getNumOfPages(userId?: number, filters?: TypeFilters): Promise<number> {
    try {
        const pool = new Pool({
            connectionString: process.env.POSTGRES_URL
        });

        const db = new Kysely<Database>({
            dialect: new PostgresDialect({ pool }),
        });

        let query = db.selectFrom('order_')
            .select([
                sql<number>`count(order_.order_id)`.as('order_count'),
            ])

        if (filters) {
            for (const value in filters) {
                const ingredients: string[] = filters[value].split(",").map((elem) => `${elem}`);
                query.where(sql`${value}`, 'in', ingredients)
            }
        }
        if (userId) {
            query = query.where('order_.customer_id', '=', userId);
        }
        return (await query.executeTakeFirst())!.order_count
    } catch (e) {
        console.log(`3помилка: ${e}`)
        return 0
    }
}