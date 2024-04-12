'use server'
import { cookies } from 'next/headers'
import logService from '@/app/AuthServerServices/login'
export default async function login(query) {
    try {
        let res = await logService(query)
        cookies().set('refreshtoken', res.refreshtoken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
        return [true, 'авторизація пройшла успішно', res.accesstoken, res.user]
    } catch (e) {
        return [false, 'помилка: ' + e]
    }
}