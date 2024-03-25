'use server'
import logoutService from '@/app/AuthServerServices/logout'
import { cookies } from 'next/headers'
import { validateAccessToken, validateRefreshToken, findToken, generateTokens, saveToken } from '@/app/AuthServerServices/tokenServices'
import { createKysely } from '@vercel/postgres-kysely';
import { sql } from 'kysely'

export default async function refresh() {
    const db = createKysely({ connectionString: process.env.POSTGRES_URL });

    const refreshtoken = cookies().get('refreshtoken')
    if (refreshtoken) {
        const userData = validateRefreshToken(refreshtoken.value);

        if (!userData) {
            throw 'токен не валидный'
        }
        const tokenFromDb = await findToken(refreshtoken.value);

        if (!tokenFromDb) {
            throw 'токена нет в бд'
        }
        const user = (await db.selectFrom('customer').where('customer_id', '=', userData.id).select(['customer_id', 'email']).execute())[0]
        if (!user) {
            console.log(user)
            throw user
        }
        const tokens = generateTokens({ id: user.customer_id, email: user.email })
        await saveToken(user.customer_id, tokens.refreshtoken)

        return {
            ...tokens, user: { id: user.customer_id, email: user.email, }
        }
    } else {
        throw 'вы не вошли!'
    }
}