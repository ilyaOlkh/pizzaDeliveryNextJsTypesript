'use server'
import { redirect } from 'next/navigation'


export default async function redirectUrl(url: string) {
    redirect(url)
}