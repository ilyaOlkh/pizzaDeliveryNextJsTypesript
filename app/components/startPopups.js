'use client'
import { useEffect } from 'react';
import { flsModules } from "../js/files/modules.js";
import Popup from "../js/libs/popup"

export default function startPopups() {
    useEffect(() => {
        console.log('Старт попапов')
        flsModules.popup = new Popup({});
        flsModules.popup._openToHash()
    }, []);
    return (<div></div>)
}