'use client'
import refresh from '@/app/AuthControllers/refresh';

export default async function refreshStart() {
    const res = await refresh()
    localStorage.setItem('accessToken', res[2])
    if (res[0]) {
        console.log(res[1])
    } else {
        alert(res[1])
    }
}