'use server'
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';


export default async function getfilters(type: Database['product']['p_type']) {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    let query = db
        .selectFrom('ingredient')
        .leftJoin('composition', 'composition.ingredient_id', 'ingredient.ingredient_id')
        .leftJoin('product', 'product.product_id', 'composition.product_id')
        .select([
            'i_type',
            sql<string>`STRING_AGG(DISTINCT i_name, ', ')`.as('i_name')
        ])
        .groupBy('i_type');

    if (type) {
        query = query.where('p_type', '=', type);
    }
    try {
        const result = await query.execute();
        return result
    } catch (err) {
        console.error('помилка:', err);

        return []; // Возвращаем пустой массив в случае ошибки
    }
};
