'use server'
import { Pool } from 'pg';
import { Kysely, sql, PostgresDialect } from 'kysely'
import { Database } from '../types/databaseSchema';
import bcrypt from 'bcrypt'
import { generateTokens, saveToken } from '@/app/AuthServerServices/tokenServices'
import { promises } from 'fs';
import { ITokens, IUser } from '../types/user';


export default async function registration(query: FormData): Promise<ITokens & { user: IUser }> {
    let queryObj: { [key: string]: string } = {};
    for (const [key, value] of query.entries()) {
        if (typeof value === 'string') {
            queryObj[key] = value;
        } else if (value instanceof File) {
            throw new Error("Каким боком был загружен файл в форму?")
        }
    }
    console.log(queryObj)

    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });

    const db = new Kysely<Database>({
        dialect: new PostgresDialect({ pool }),
    });

    const candidateEmail = await db.selectFrom('customer').where('email', '=', queryObj.email).execute()
    const candidatePhone = await db.selectFrom('customer').where('phone', '=', queryObj.phone).execute()

    if (candidateEmail.length > 0) {
        throw `Користувач із поштовим індексом ${queryObj.email} вже існує`
    }
    if (candidatePhone.length > 0) {
        throw `Користувач із номером ${queryObj.phone} вже існує`
    }
    queryObj.password = await bcrypt.hash(queryObj.password, 3)
    const customer = await db.insertInto('customer').values({
        first_name: queryObj.name,
        last_name: queryObj.surname,
        phone: queryObj.phone,
        email: queryObj.email,
        street: queryObj.street,
        house: queryObj.house,
        entrance: queryObj.entrance === '' ? sql`NULL` : queryObj.entrance,
        floor: queryObj.floor === '' ? sql`NULL` : parseInt(queryObj.floor),
        apartment: queryObj.apartment === '' ? sql`NULL` : parseInt(queryObj.apartment),
        intercom_code: queryObj.intercom_code == '' ? sql`NULL` : queryObj.intercom_code,
        discount: +0,
        password: queryObj.password,
        refreshtoken: sql`NULL`
    }).returning('customer_id').executeTakeFirst()

    if (!customer) {
        throw `customer === undefined`
    }
    const customer_id = customer.customer_id
    if (!customer_id) {
        throw `customer.customer_id === undefined`
    }

    const tokens = generateTokens({
        customer_id: customer_id,
        first_name: queryObj.name,
        last_name: queryObj.surname,
        phone: queryObj.phone,
        email: queryObj.email,
        street: queryObj.street,
        house: queryObj.house,
        entrance: queryObj.entrance === '' ? null : queryObj.entrance,
        floor: queryObj.floor === '' ? null : parseInt(queryObj.floor),
        apartment: queryObj.apartment === '' ? null : parseInt(queryObj.apartment),
        intercom_code: queryObj.intercom_code === '' ? null : queryObj.intercom_code,
        discount: +0,
        role: null // приемлимо потому, что в момент регистрации не может быть роли
    })
    await saveToken(customer_id, tokens.refreshtoken)

    return {
        ...tokens, user: {
            customer_id: customer_id,
            first_name: queryObj.name,
            last_name: queryObj.surname,
            phone: queryObj.phone,
            email: queryObj.email,
            street: queryObj.street,
            house: queryObj.house,
            entrance: queryObj.entrance === '' ? null : queryObj.entrance,
            floor: queryObj.floor === '' ? null : parseInt(queryObj.floor),
            apartment: queryObj.apartment === '' ? null : parseInt(queryObj.apartment),
            intercom_code: queryObj.intercom_code === '' ? null : queryObj.intercom_code,
            discount: +0,
            role: null
        }
    }
}