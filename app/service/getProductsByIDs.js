'use server'
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'


export async function getProductsByIDs(idArray) {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });

    let query = db
        .selectFrom('pizzadetails')
        .leftJoin('product', 'pizzadetails.product_id', 'product.product_id')
        .select([
            'pizzadetails.id',
            'product.product_id',
            'product.p_name',
            // 'product.image_url',
            sql`COALESCE(image_url, 'img/pizzas/noPhoto.png')`.as('image_url'),
            'pizzadetails.size_cm',
            'pizzadetails.weight_g',
            'pizzadetails.price',
        ])

    let querytextGlobal = ``
    if (!idArray || idArray.length == 0) {
        return []
    }
    for (const value of idArray) {
        querytextGlobal += `pizzadetails.id = ${value} OR `
    }
    querytextGlobal = querytextGlobal.slice(0, -4);
    console.log(querytextGlobal)
    query = query.where(sql(querytextGlobal));

    query = query.orderBy('pizzadetails.id');

    try {
        const result = await query.execute();
        return result;
    } catch (err) {
        console.error('error:', err);
        return [];
    }
}
