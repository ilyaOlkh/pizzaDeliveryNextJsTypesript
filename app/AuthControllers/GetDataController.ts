'use server'

import { validateRefreshToken } from '@/app/AuthServerServices/tokenServices'
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely'
import { cookies } from 'next/headers'
import { Database } from '../types/databaseSchema';
import { ITokens, IUser } from '../types/user';

export type TypeResponce = TypeResponceTrue | TypeResponceFalse

export type TypeResponceTrue = [
    isSuccess: true,
    info: 'valid',
    UserData: IUser,
    role?: string | null
]

export type TypeResponceFalse = [
    isSuccess: false,
    info: 'NeedAuth' | 'NeedRefresh' | 'IDs are not equal',
]

export type TypeResponceAuth = [
    isSuccess: true,
    info: 'Реєстрація пройшла успішно',
    refresh: ITokens['refreshtoken'],
    UserData: IUser,
]

export type TypeResponceFalseNoStrict = [
    isSuccess: false,
    info: string,
]

export type TypeResponceWithoutData = [
    isSuccess: boolean,
    info: string,
]
export async function CheckWithoutAccessToken(): Promise<TypeResponce> {
    const refreshtoken = cookies().get('refreshtoken')
    if (!refreshtoken) {
        return [false, 'NeedAuth']
    }

    const refresh = validateRefreshToken(refreshtoken.value);
    if (!refresh) {
        return [false, 'NeedAuth']
    }

    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    const data = await db.selectFrom('customer')
        .leftJoin('worker', 'customer.customer_id', "worker.account")
        .select([
            'customer.refreshtoken',
            'worker.role'
        ])
        .where("customer_id", '=', refresh.customer_id)
        .executeTakeFirst()
    if (!data) {
        return [false, 'NeedAuth']
    }
    if (data.refreshtoken != refreshtoken.value) {
        return [false, 'NeedAuth']
    }

    const refreshFromDB = validateRefreshToken(data.refreshtoken);
    if (!refreshFromDB || (refreshFromDB.customer_id != refresh.customer_id)) {
        return [false, 'NeedAuth']
    }

    return [true, 'valid', refresh, data.role]
}

export async function GetUserInfoForServer(): Promise<TypeResponce> {
    let res = await CheckWithoutAccessToken()
    if (!res[0]) {
        return res
    }
    const userData = res[2]
    const isAdmin = res[3]
    return [true, 'valid', userData, isAdmin]
}

export async function getUserCookies(): Promise<TypeResponce> {
    const refreshtoken = cookies().get('refreshtoken')
    if (!refreshtoken) {
        return [false, 'NeedAuth']
    }

    const refresh = validateRefreshToken(refreshtoken.value);
    if (!refresh) {
        return [false, 'NeedAuth']
    }

    return [true, "valid", refresh]
}
