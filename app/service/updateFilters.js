'use server'
import { redirect } from 'next/navigation'
import { flsModules } from "../js/files/modules.js";


export async function updateFilters(formData, searchParams) {
    let filters = new URLSearchParams({});
    for (var key of formData.keys()) {
        filters.set(key, formData.getAll(key))
    }
    const params = new URLSearchParams(filters)
    redirect(`?${params}`)
}