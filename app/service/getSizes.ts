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
        .innerJoin('pizzadetails', 'pizzadetails.product_id', 'product.product_id')
        .select([
            'pizzadetails.id',
            'pizzadetails.size_cm',
            'pizzadetails.weight_g',
            'pizzadetails.price',
        ])
        .where('product.product_id', '=', id);
    try {
        const result = await query.execute();
        return result
    } catch (err) {
        console.error('Помилка:', err);

        return []; // Возвращаем пустой массив в случае ошибки
    }
};