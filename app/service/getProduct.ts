'use server'
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';
import { IProduct } from '../types/products';

export const getProduct = async (id: number): Promise<IProduct | undefined> => {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    let query = db
        .selectFrom('product')
        .select([
            'product.product_id',
            'product.p_name',
            'product.p_type',
            'product.added_date',
            sql<string>`COALESCE(product.image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
        ])
        .where('product.product_id', '=', id)
        .groupBy('product.product_id');
    try {
        const result = await query.executeTakeFirst();
        return result
    } catch (err) {
        console.error('Помилка:', err);

        return undefined; // Возвращаем пустой массив в случае ошибки
    }
};