'use server'
import { ReadonlyURLSearchParams, redirect } from 'next/navigation'


export async function updateFilters(formData: FormData, searchParams: ReadonlyURLSearchParams) {
    let oldSearchParams = new URLSearchParams(searchParams)
    let filters = new URLSearchParams({});
    const dir = oldSearchParams.get(process.env.NEXT_PUBLIC_DIR_PARAM)
    const sort = oldSearchParams.get(process.env.NEXT_PUBLIC_SORT_PARAM)
    if (sort) {
        filters.set(process.env.NEXT_PUBLIC_SORT_PARAM, sort)
    }
    if (dir) {
        filters.set(process.env.NEXT_PUBLIC_DIR_PARAM, dir)
    }
    for (var key of formData.keys()) {
        filters.set(key, formData.getAll(key).toString())
    }
    const params = new URLSearchParams(filters)
    redirect(`?${params}`)
}