'use server'
import { redirect } from 'next/navigation'
import { flsModules } from "../js/files/modules.js";


export async function updateFilters(formData, searchParams) {
    let oldSearchParams = new URLSearchParams(searchParams)
    let filters = new URLSearchParams({});
    if (oldSearchParams.get([process.env.NEXT_PUBLIC_SORT_PARAM])) {
        filters.set(process.env.NEXT_PUBLIC_SORT_PARAM, oldSearchParams.get([process.env.NEXT_PUBLIC_SORT_PARAM]))
    }
    if (oldSearchParams.get([process.env.NEXT_PUBLIC_DIR_PARAM])) {
        filters.set(process.env.NEXT_PUBLIC_DIR_PARAM, oldSearchParams.get([process.env.NEXT_PUBLIC_DIR_PARAM]))
    }
    for (var key of formData.keys()) {
        filters.set(key, formData.getAll(key))
    }
    const params = new URLSearchParams(filters)
    redirect(`?${params}`)
}