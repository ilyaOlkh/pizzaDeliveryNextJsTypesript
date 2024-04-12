'use server'
import { createKysely } from '@vercel/postgres-kysely';
import bcrypt from 'bcrypt'
import { generateTokens, saveToken } from '@/app/AuthServerServices/tokenServices'


export default async function registration(query) {
    let queryObj = {};
    for (let key of query.keys()) {
        queryObj[key] = query.get(key)
    }
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });

    const candidateEmail = await db.selectFrom('customer').where('email', '=', queryObj.email).execute()
    const candidatePhone = await db.selectFrom('customer').where('phone', '=', queryObj.phone).execute()

    if (candidateEmail.length > 0) {
        throw `Користувач із поштовим індексом ${queryObj.email} вже існує`
    }
    if (candidatePhone.length > 0) {
        throw `Користувач із номером ${queryObj.phone} вже існує`
    }
    queryObj.password = await bcrypt.hash(queryObj.password, 3)
    await db.insertInto('customer').values({
        first_name: queryObj.name,
        last_name: queryObj.surname,
        phone: queryObj.phone,
        email: queryObj.email,
        street: queryObj.street,
        house: queryObj.house,
        entrance: queryObj.entrance == '' ? null : queryObj.entrance,
        floor: +queryObj.floor == 0 ? null : queryObj.floor,
        apartment: +queryObj.apartment == 0 ? null : queryObj.apartment,
        intercom_code: queryObj.intercom_code == '' ? null : queryObj.intercom_code,
        discount: +0,
        password: queryObj.password,
        refreshtoken: null
    }).execute()

    const id = (await db.selectFrom('customer').select(['customer_id']).where('email', '=', queryObj.email).execute())[0].customer_id
    const tokens = generateTokens({
        customer_id: id,
        first_name: queryObj.name,
        last_name: queryObj.surname,
        phone: queryObj.phone,
        email: queryObj.email,
        street: queryObj.street,
        house: queryObj.house,
        entrance: queryObj.entrance == '' ? null : queryObj.entrance,
        floor: +queryObj.floor == 0 ? null : queryObj.floor,
        apartment: +queryObj.apartment == 0 ? null : queryObj.apartment,
        intercom_code: queryObj.intercom_code == '' ? null : queryObj.intercom_code,
        discount: +0,
    })
    await saveToken(id, tokens.refreshtoken)

    return {
        ...tokens, user: {
            customer_id: id,
            first_name: queryObj.name,
            last_name: queryObj.surname,
            phone: queryObj.phone,
            email: queryObj.email,
            street: queryObj.street,
            house: queryObj.house,
            entrance: queryObj.entrance == '' ? null : queryObj.entrance,
            floor: +queryObj.floor == 0 ? null : queryObj.floor,
            apartment: +queryObj.apartment == 0 ? null : queryObj.apartment,
            intercom_code: queryObj.intercom_code == '' ? null : queryObj.intercom_code,
            discount: +0,
        }
    }
}