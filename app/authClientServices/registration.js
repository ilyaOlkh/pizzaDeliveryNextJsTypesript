'use client'
import registration from '../AuthControllers/registration'
import { show, hide } from '../components/loading'
export default async function registrationStart(query) {
    show()
    const res = await registration(query)
    if (res[0]) {
        console.log(res[1])
        localStorage.setItem('accessToken', res[2])
    } else {
        alert(res[1])
    }
    hide()
}