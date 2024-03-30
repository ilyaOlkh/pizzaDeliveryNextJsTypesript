'use server'
import { redirect } from 'next/navigation'

export default async function setId(filters) {
    const params = new URLSearchParams(filters)
    if (!params.has(process.env.NEXT_PUBLIC_ID_FOR_PRODUCT)) {
        params.append(process.env.NEXT_PUBLIC_ID_FOR_PRODUCT, 1)

    }
    redirect(`?${params}`)
}