'use server'
import refresh from '@/app/AuthServerServices/refresh'
import { cookies } from 'next/headers'

export default async function refreshController() {
    try {
        const res = await refresh()
        cookies().set('refreshtoken', res.refreshtoken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
        return [true, 'оновлення успішно завершено у користувача ' + res.user.id, res.accesstoken]
    }
    catch (e) {
        return [false, 'помилка: ' + e]
    }
}