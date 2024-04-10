'use server'
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'
import getProductTypes from '../service/getProductTypes'

export default async (req) => {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });
    const type = req.type;
    const filters = req.filters;
    const limit = req.limit;
    const sort = req.sort;

    let query = db
        .selectFrom('product')
        .leftJoin('composition', 'composition.product_id', 'product.product_id')
        .leftJoin('ingredient', 'ingredient.ingredient_id', 'composition.ingredient_id')
    if (sort?.sortRule == 'rating') {
        query = query.leftJoin(sql(`(SELECT 
        product.product_id, 
        count(order_details_id) as rating
    FROM 
        product
    LEFT JOIN 
        pizzadetails ON product.product_id = pizzadetails.product_id
    LEFT JOIN 
        orderdetails ON pizzadetails.id = orderdetails.pizzadetails_id
    WHERE 
        p_type = 'піца'
    GROUP BY 
        product.product_id) AS order_counts`), 'product.product_id', 'order_counts.product_id')
    }
    query = query.select([
        'product.product_id',
        'p_name',
        (sort?.sortRule == 'rating') ? 'order_counts.rating' : null,
        'is_available',
        'added_date',
        // 'image_url',
        sql`COALESCE(image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
        sql`COALESCE(STRING_AGG(i_name, ', '), 'нет состава')`.as('composition')
    ].filter(Boolean))

    if (type) {
        query = query.where('p_type', '=', type);
    }
    query = query.groupBy(sql(`product.product_id${(sort?.sortRule == 'rating') ? ', rating' : ''}`));
    if (filters) {
        let querytextGlobal = ``
        for (const value in filters) {
            const ingredients = filters[value].split(",").map((elem) => `'${elem}'`);
            let querytext = ''
            ingredients.forEach(element => {
                querytext += element + ', '
            });
            querytext = querytext.slice(0, -2);
            querytextGlobal += `SUM(CASE WHEN i_name in (${querytext}) THEN 1 ELSE 0 END) >= 1 AND `
        }
        querytextGlobal = querytextGlobal.slice(0, -4);

        query = query.having(sql(querytextGlobal));
    }
    if (sort) {
        query = query.orderBy(sql(sort.sortRule), sort.direction)
    } else {
        query = query.orderBy('product.product_id');
    }
    if (limit) {
        query = query.limit(limit);
    }
    try {
        const result = await query.execute();
        return result;
    } catch (err) {
        console.error('error:', err);
        return [];
    }
};
