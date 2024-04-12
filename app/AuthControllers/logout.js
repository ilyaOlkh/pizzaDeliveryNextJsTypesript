'use server'
import logout from '@/app/AuthServerServices/logout'



export default async function logoutController() {
    try {
        const res = await logout()
        return [true, 'вихід завершено успішно у користувача ' + res]
    }
    catch (e) {
        return [false, 'помилка: ' + e]
    }
}