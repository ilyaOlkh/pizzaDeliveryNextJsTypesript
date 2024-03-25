'use server'
import { cookies } from 'next/headers'
import regService from '@/app/AuthServerServices/registration'
export default async function registration(query) {
    try {
        let res = await regService(query)
        cookies().set('refreshtoken', res.refreshtoken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
        return [true, 'регистрация прошла успешно', res.accesstoken, res.user]
    } catch (e) {
        return [false, 'ошибка: ' + e]
    }
}