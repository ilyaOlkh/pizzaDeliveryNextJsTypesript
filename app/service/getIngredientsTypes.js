export default async function getIngredientsTypes() {
    let types = await query()
    return types.map(type => {
        return type.i_type
    })
}
import { sql } from 'kysely'

import { createKysely } from '@vercel/postgres-kysely';

async function query() {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });
    let query = db
        .selectFrom('ingredient')
        .select([
            sql`distinct i_type`,
        ])
    try {
        const result = await query.execute();
        return result
    } catch (err) {
        console.error('error:', err);
        return []; // Возвращаем пустой массив в случае ошибки
    }
};