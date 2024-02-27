'use server'
import { redirect } from 'next/navigation'
import { flsModules } from "../js/files/modules.js";


export async function updateFilters(formData) {
    let filters = {};
    for (var key of formData.keys()) {
        filters[key] = formData.getAll(key)
    }
    const params = new URLSearchParams(filters)
    console.log(params)
    redirect(`?${params}`)
}