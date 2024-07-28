import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';

export default async function getIngredientsTypes() {
    let types = await query()
    return types.map(type => {
        return type.i_type
    })
}

async function query() {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });
    let query = db
        .selectFrom('ingredient')
        .select('i_type')
        .distinct()
    try {
        const result = await query.execute();
        return result
    } catch (err) {
        console.error('помилка:', err);
        return [];
    }
};