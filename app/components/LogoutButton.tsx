'use client'
import logout from '@/app/AuthControllers/logout';
// import Image from "next/image";
import { MyContext } from '@/app/context/contextProvider';
import { useContext } from 'react';
import { show, hide } from '@/app/components/loading'
import { useSafeContext } from '../service/useSafeContext';


export default function LogoutButton(): JSX.Element {
    const { userState, setUser } = useSafeContext(MyContext);
    async function logoutStart() {
        show()
        const res = await logout()
        if (res[0]) {
            setUser(null)
        } else {
            alert(res[1])
        }
        hide()
    }
    return (
        <button id='exit' onClick={logoutStart} className="header__link header__link_account header__link_right">
            <span>Вийти з аккаунту</span>
        </button>
    )
}