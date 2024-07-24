'use server'
import { cookies } from 'next/headers'
import regService from '@/app/AuthServerServices/registration'
import { TypeResponceAuth, TypeResponceFalseNoStrict } from './GetDataController'
export default async function registration(query: FormData): Promise<TypeResponceAuth | TypeResponceFalseNoStrict> {
    try {
        let res = await regService(query)
        cookies().set('refreshtoken', res.refreshtoken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
        return [true, 'Реєстрація пройшла успішно', res.accesstoken, res.user]
    } catch (e) {
        return [false, 'помилка: ' + e]
    }
}