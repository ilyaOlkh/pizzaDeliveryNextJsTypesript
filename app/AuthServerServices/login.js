'use server'
import { createKysely } from '@vercel/postgres-kysely';
import bcrypt from 'bcrypt'
import { generateTokens, saveToken } from '@/app/AuthServerServices/tokenServices'

export default async function login(query) {
    let queryObj = {};
    for (let key of query.keys()) {
        queryObj[key] = query.get(key)
    }
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });

    let candidateEmail = await db.selectFrom('customer').where('email', '=', queryObj.email).select(['customer_id', 'first_name', 'last_name', 'phone', 'email', 'street',
        'house', 'entrance', 'floor', 'apartment', 'intercom_code', 'discount', 'password']).execute()
    if (candidateEmail.length == 0) {
        throw `Пользователь с почтовым индексом ${queryObj.email} не найден`
    }
    candidateEmail = candidateEmail[0]
    if (!(await bcrypt.compare(queryObj.password, candidateEmail.password))) {
        throw `Пароль не верный!`
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
        discount: candidateEmail.discount,
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
            discount: candidateEmail.discount,
        }
    }
}