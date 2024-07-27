'use server'
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';

export default async (id: number) => {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    let query = db
        .selectFrom('product')
        .innerJoin('composition', 'composition.product_id', 'product.product_id')
        .innerJoin('ingredient', 'ingredient.ingredient_id', 'composition.ingredient_id')
        .select([
            'ingredient.i_type',
            'ingredient.i_name',
        ])
        .where('product.product_id', '=', id);
    try {
        const result = await query.execute();
        return result
    } catch (err) {
        console.error('помилка:', err);

        return []; // Возвращаем пустой массив в случае ошибки
    }
};