'use server'

import { validateAccessToken, validateRefreshToken } from '@/app/AuthServerServices/tokenServices'
import { createKysely } from '@vercel/postgres-kysely';
import { cookies } from 'next/headers'

export async function CheckAccess(accesstoken) {
    if (!accesstoken) {
        return [false, 'NeedRefresh']
    }
    const refreshtoken = cookies().get('refreshtoken')
    if (!refreshtoken) {
        return [false, 'NeedAuth']
    }
    const refresh = validateRefreshToken(refreshtoken.value);
    if (!refresh) {
        return [false, 'NeedAuth']
    }
    const userData = validateAccessToken(accesstoken);
    if (!userData) {
        return [false, 'NeedRefresh']
    }

    if (refresh.id != userData.id) {
        return [false, 'IDs are not equal']
    }
    return [true, 'valid', userData]
}

export async function CheckWithoutAccessToken() {
    const refreshtoken = cookies().get('refreshtoken')
    if (!refreshtoken) {
        return [false, 'NeedAuth']
    }
    const refresh = validateRefreshToken(refreshtoken.value);
    if (!refresh) {
        return [false, 'NeedAuth']
    }
    return [true, 'valid', refresh]
}

export async function GetUserInfo(accesstoken) {
    let res = await CheckAccess(accesstoken)
    if (!res[0]) {
        return res
    }
    const userData = res[2]
    const db = createKysely({ connectionString: process.env.POSTGRES_URL })
    const data = await db.selectFrom('customer').select(['customer_id', 'first_name', 'last_name', 'phone', 'email', 'street', 'house', 'entrance', 'floor', 'apartment', 'intercom_code', 'discount'])
        .where("customer_id", '=', userData.id)
        .execute()

    return [true, data[0]]
}
export async function GetAuthStatus(accesstoken) {
    let res = await CheckAccess(accesstoken)
    if (!res[0]) {
        return res
    }
    return [true, true]
}

export async function GetUserInfoForServer() {
    let res = await CheckWithoutAccessToken()
    if (!res[0]) {
        return res
    }
    const userData = res[2]
    // const db = createKysely({ connectionString: process.env.POSTGRES_URL })
    // const data = await db.selectFrom('customer').select(['customer_id', 'first_name', 'last_name', 'phone', 'email', 'street', 'house', 'entrance', 'floor', 'apartment', 'intercom_code', 'discount'])
    //     .where("customer_id", '=', userData.id)
    //     .execute()
    // cookies().set('userObj', '1', { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
    return [true, userData]
}