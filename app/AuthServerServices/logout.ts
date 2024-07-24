'use server'
import { cookies } from 'next/headers'
import { removeToken } from '@/app/AuthServerServices/tokenServices'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { customer_id } from '../types/user'

export default async function logout(): Promise<customer_id> {
    const refreshtoken: RequestCookie | undefined = cookies().get('refreshtoken')
    if (refreshtoken) {
        const res: customer_id = await removeToken(refreshtoken.value)
        cookies().delete('refreshtoken')
        return res
    } else {
        throw 'ви не увійшли!'
    }
}