'use client'
import loginController from '../AuthControllers/login'
import { show, hide } from '../components/loading'

import { MyContext } from '../context/contextProvider'
import { useContext } from 'react';

export default async function loginStart(query) {
    const { user, setUser } = useContext(MyContext);
    show()
    const res = await loginController(query)
    if (res[0]) {
        console.log(res[1])
        localStorage.setItem('accessToken', res[2])
        setUser(res[3])
    } else {
        // alert(res[1])
    }
    hide()
}