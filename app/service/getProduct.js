'use server'
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'
import { cache } from 'react'


export const getProduct = cache(async (id) => {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });

    let query = db
        .selectFrom('product')
        // .leftJoin()
        .select([
            'product.product_id',
            'product.p_name',
            'product.p_type',
            'product.added_date',
            sql`COALESCE(product.image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
        ])
    if (id) {
        query = query.where('product.product_id', '=', +id);
    } else {
        console.log('Помилка!')
    }
    query = query.groupBy('product.product_id');
    try {
        const result = await query.execute();
        return result
    } catch (err) {
        console.error('Помилка:', err);

        return []; // Возвращаем пустой массив в случае ошибки
    }
});