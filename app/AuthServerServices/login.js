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

    let candidateEmail = await db.selectFrom('customer')
        .leftJoin('worker', 'customer.customer_id', "worker.account")
        .where('email', '=', queryObj.email)
        .select(['customer.customer_id', 'customer.first_name', 'customer.last_name', 'customer.phone', 'customer.email', 'customer.street',
            'customer.house', 'customer.entrance', 'customer.floor', 'customer.apartment', 'customer.intercom_code', 'customer.discount', 'customer.password', 'worker.role'])
        .execute()
    if (candidateEmail.length == 0) {
        throw `Користувача з поштовим індексом ${queryObj.email} не знайдено`
    }
    candidateEmail = candidateEmail[0]
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
        discount: candidateEmail.discount,
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
            discount: candidateEmail.discount,
            role: candidateEmail.role,
        }
    }
}