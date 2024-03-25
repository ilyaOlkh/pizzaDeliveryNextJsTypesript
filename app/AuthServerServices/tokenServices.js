import jwt from 'jsonwebtoken'
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export function generateTokens(payload) {
    const accesstoken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30s' })
    const refreshtoken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    return {
        accesstoken,
        refreshtoken
    }
}

export async function saveToken(userId, refreshtoken) {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });
    await db
        .updateTable('customer')
        .set({
            refreshtoken: refreshtoken
        })
        .where('customer_id', '=', +userId)
        .execute();
}
export async function removeToken(refreshtoken) {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });

    let id = await db.selectFrom('customer').select(['customer_id'])
        .where('refreshtoken', '=', refreshtoken)
        .execute();

    await db.updateTable('customer')
        .set({ refreshtoken: null })
        .where('refreshtoken', '=', refreshtoken)
        .execute();

    if (id.length > 0) {
        return id[0].customer_id
    }
}

export async function refreshToken(refreshtoken) {
    if (!refreshtoken) {
        console.log('пользователь не авторизован')
        return
    }
}

export function validateAccessToken(token) {
    try {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return userData;
    } catch (e) {
        return null;
    }
}

export function validateRefreshToken(token) {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return userData;
    } catch (e) {
        return null;
    }
}

export async function findToken(refreshtoken) {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });
    let id = await db.selectFrom('customer').select(['customer_id'])
        .where('refreshtoken', '=', refreshtoken)
        .execute();

    if (id.length > 0) {
        return id[0].customer_id
    }
}