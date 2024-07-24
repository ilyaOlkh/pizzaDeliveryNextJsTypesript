import jwt, { UserJwtPayload } from 'jsonwebtoken'

import { Pool } from 'pg';
import { Kysely, PostgresDialect, sql } from 'kysely'

import { IUser, ITokens } from '../types/user';
import { Database } from '../types/databaseSchema';
import { UserJwtPayloadCast } from '../service/checkParams';
import { customer_id } from '../types/user';

export function generateTokens(payload: IUser): ITokens {
    const accesstoken: string = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30s' })
    const refreshtoken: string = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    return {
        accesstoken,
        refreshtoken
    }
}

export async function saveToken(userId: number, refreshtoken: ITokens["refreshtoken"]): Promise<void> {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    await db
        .updateTable('customer')
        .set({
            refreshtoken: refreshtoken
        })
        .where('customer_id', '=', +userId)
        .execute();
}
export async function removeToken(refreshtoken: ITokens["refreshtoken"]): Promise<customer_id> {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    const customer = await db.selectFrom('customer').select(['customer_id'])
        .where('refreshtoken', '=', refreshtoken)
        .executeTakeFirst();

    await db.updateTable('customer')
        .set({ refreshtoken: sql`NULL` })
        .where('refreshtoken', '=', refreshtoken)
        .execute();

    if (customer && customer.customer_id) {
        return customer.customer_id
    } else {
        return null
    }
}

export function validateAccessToken(token: ITokens["accesstoken"]): UserJwtPayload | null {
    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        if (typeof payload === "string") {
            return null;
        } else {
            return UserJwtPayloadCast(payload)
        }
    } catch (e) {
        console.log(`[${new Date}]: ${e}`)
        return null;
    }
}

export function validateRefreshToken(token: ITokens["refreshtoken"]): UserJwtPayload | null {
    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        if (typeof payload === "string") {
            return null;
        } else {
            return UserJwtPayloadCast(payload)
        }
    } catch (e) {
        console.log(`[${new Date}]: ${e}`)
        return null;
    }
}

export async function findToken(refreshtoken: ITokens["refreshtoken"]): Promise<customer_id> {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    const customer = await db.selectFrom('customer').select(['customer_id'])
        .where('refreshtoken', '=', refreshtoken)
        .executeTakeFirst();

    if (customer && customer.customer_id) {
        return customer.customer_id
    } else {
        return null
    }
}