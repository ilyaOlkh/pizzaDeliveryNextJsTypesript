'use server'
import logout from '@/app/AuthServerServices/logout'



export default async function logoutController() {
    try {
        const res = await logout()
        return [true, 'выход завершен успешно у пользователя ' + res]
    }
    catch (e) {
        return [false, 'ошибка: ' + e]
    }
}