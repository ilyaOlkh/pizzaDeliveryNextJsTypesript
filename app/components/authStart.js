'use client'
import GetAuthStatusService from "../authClientServices/getAuthStatus";
import { useEffect } from "react";

export default async function authStart() {
    useEffect(() => {

        const fetchData = async () => {
            console.log('проверка авторизации')
            let auth = await GetAuthStatusService()
            localStorage.setItem('auth', auth[1])
        };

        fetchData();
    }, []);
    return <></>
}