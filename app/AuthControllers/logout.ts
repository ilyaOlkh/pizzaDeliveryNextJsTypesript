'use server'
import logout from '@/app/AuthServerServices/logout'

import { TypeResponceWithoutData } from './GetDataController'
import { customer_id } from '../types/user'

export default async function logoutController(): Promise<TypeResponceWithoutData> {
    try {
        const res: customer_id = await logout()
        return [true, 'вихід завершено успішно у користувача ' + res]
    }
    catch (e) {
        return [false, 'помилка: ' + e]
    }
}