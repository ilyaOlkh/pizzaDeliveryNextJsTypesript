'use server'
import bcrypt from 'bcrypt'
import { generateTokens, saveToken } from '@/app/AuthServerServices/tokenServices'

import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';

import { IUser, IUserSecret, ITokens } from '../types/user';

export default async function login(query: FormData): Promise<ITokens & { user: IUser }> {
    let queryObj: { [key: string]: string } = {};
    for (let key of query.keys()) {
        queryObj[key] = query.get(key)!.toString()
    }

    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    let candidateEmail: IUserSecret | undefined = await db.selectFrom('customer')
        .leftJoin('worker', 'customer.customer_id', "worker.account")
        .where('email', '=', queryObj.email)
        .select(['customer.customer_id', 'customer.first_name', 'customer.last_name', 'customer.phone', 'customer.email', 'customer.street',
            'customer.house', 'customer.entrance', 'customer.floor', 'customer.apartment', 'customer.intercom_code', 'customer.discount', 'customer.password', 'worker.role'])
        .executeTakeFirst()
    if (candidateEmail === undefined) {
        throw `Користувача з поштовим індексом ${queryObj.email} не знайдено`
    }

    if (!(await bcrypt.compare(queryObj.password, candidateEmail.password))) {
        throw `Пароль не є вірним!`
    }
    const tokens = generateTokens({
        customer_id: candidateEmail.customer_id,
        first_name: candidateEmail.first_name,
        last_name: candidateEmail.last_name,
        phone: candidateEmail.phone,
        email: candidateEmail.email,
        street: candidateEmail.street,
        house: candidateEmail.house,
        entrance: candidateEmail.entrance,
        floor: candidateEmail.floor,
        apartment: candidateEmail.apartment,
        intercom_code: candidateEmail.intercom_code,
        discount: +candidateEmail.discount,
        role: candidateEmail.role,
    })
    await saveToken(candidateEmail.customer_id, tokens.refreshtoken)


    return {
        ...tokens, user: {
            customer_id: candidateEmail.customer_id,
            first_name: candidateEmail.first_name,
            last_name: candidateEmail.last_name,
            phone: candidateEmail.phone,
            email: candidateEmail.email,
            street: candidateEmail.street,
            house: candidateEmail.house,
            entrance: candidateEmail.entrance,
            floor: candidateEmail.floor,
            apartment: candidateEmail.apartment,
            intercom_code: candidateEmail.intercom_code,
            discount: +candidateEmail.discount,
            role: candidateEmail.role,
        }
    }
}