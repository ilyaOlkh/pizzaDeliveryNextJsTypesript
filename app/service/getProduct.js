'use server'
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export default async (id) => {
    console.log(id)

    const db = createKysely({ connectionString: process.env.POSTGRES_URL });

    let query = db
        .selectFrom('product')
        .innerJoin('composition', 'composition.product_id', 'product.product_id')
        .leftJoin('ingredient', 'ingredient.ingredient_id', 'composition.ingredient_id')
        .select([
            'product.product_id',
            'product.p_name',
            'product.is_available',
            'product.added_date',
            sql`COALESCE(product.image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
            sql`COALESCE(STRING_AGG(i_name, ', '), 'нет состава')`.as('composition')
        ])

    if (id) {
        console.log(id)
        query = query.where('product.product_id', '=', +id);
    }
    query = query.groupBy('product.product_id');
    try {
        const result = await query.execute();
        return result
    } catch (err) {
        console.error('error:', err);

        return []; // Возвращаем пустой массив в случае ошибки
    }
};