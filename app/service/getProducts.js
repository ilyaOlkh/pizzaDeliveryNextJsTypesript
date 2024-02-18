import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export default async (req) => {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });
    const type = req.type;
    const filters = req.filters;
    const limit = req.limit;


    let query = db
        .selectFrom('product')
        .leftJoin('composition', 'composition.product_id', 'product.product_id')
        .leftJoin('ingredient', 'ingredient.ingredient_id', 'composition.ingredient_id')
        .select([
            'product.product_id',
            'p_name',
            'is_available',
            'added_date',
            'image_url',
            sql`COALESCE(image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
            sql`COALESCE(STRING_AGG(i_name, ', '), 'нет состава')`.as('composition')
        ])

    if (type) {
        query = query.where('p_type', '=', type);
    }
    query = query.groupBy('product.product_id');
    if (filters) {
        let querytextGlobal = ``
        for (const value in filters) {

            const ingredients = filters[value].split(",").map((elem) => `'${elem}'`);
            let querytext = ''
            ingredients.forEach(element => {
                console.log(querytext)
                querytext += element + ', '
            });
            querytext = querytext.slice(0, -2);
            querytextGlobal += `SUM(CASE WHEN i_name in (${querytext}) THEN 1 ELSE 0 END) >= 1 OR `
        }
        querytextGlobal = querytextGlobal.slice(0, -4);
        console.log(querytextGlobal)

        query = query.having(sql(querytextGlobal));

    }
    query = query.orderBy('product.product_id');
    if (limit) {
        query = query.limit(limit);
    }

    try {
        const result = await query.execute();
        return result; // Возвращаем результат
    } catch (err) {
        console.error('error:', err);
        return []; // Возвращаем пустой массив в случае ошибки
    }
};
