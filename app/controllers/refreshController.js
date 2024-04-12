'use server'
import { cookies } from 'next/headers'
import { refreshToken } from '@/app/AuthServerServices/tokenServices'

export default async function refresh() {
    try {
        const refreshtoken = cookies().get('refreshtoken')
        if (refreshtoken) {
            const res = await logoutService(refreshtoken.value)
            const userData = await refreshToken(refreshtoken.value)
            return userData
        } else {
            return {
                message: 'ви не увійшли!'
            }
        }
    } catch (e) {
        console.log(e)
    }
}