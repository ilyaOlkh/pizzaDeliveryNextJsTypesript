'use server'
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export default async (id) => {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });
    let query = db
        .selectFrom('product')
        .innerJoin('composition', 'composition.product_id', 'product.product_id')
        .leftJoin('ingredient', 'ingredient.ingredient_id', 'composition.ingredient_id')
        .select([
            'ingredient.i_type',
            'ingredient.i_name',
        ])

    if (id) {
        query = query.where('product.product_id', '=', +id);
    } else (
        console.log('ОШИБКА!')
    )
    try {
        const result = await query.execute();
        return result
    } catch (err) {
        console.error('error:', err);

        return []; // Возвращаем пустой массив в случае ошибки
    }
};