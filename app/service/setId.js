'use server'
import { redirect } from 'next/navigation'
import { settings } from '@/app/settings';

export default async function setId(filters) {
    const params = new URLSearchParams(filters)
    // console.log(params)
    if (!params.has(settings.idForProduct)) {
        params.append('id', 1)

    }
    console.log(params)

    redirect(`?${params}`)
}