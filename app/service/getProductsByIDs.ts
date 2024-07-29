'use server'
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';


export async function getProductsByIDs(idArray: number[]) {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    let query = db
        .selectFrom('pizzadetails')
        .innerJoin('product', 'pizzadetails.product_id', 'product.product_id')
        .select([
            'pizzadetails.id',
            // 'product.product_id',
            'product.p_name',
            // 'product.image_url',
            sql<string>`COALESCE(image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
            'pizzadetails.size_cm',
            'pizzadetails.weight_g',
            'pizzadetails.price',
        ])

    if (!idArray || idArray.length == 0) {
        return []
    }
    query = query.where('pizzadetails.id', 'in', idArray)
    query = query.orderBy('pizzadetails.id');

    try {
        const result = await query.execute();
        return result;
    } catch (err) {
        console.error('Помилка:', err);
        return [];
    }
}
