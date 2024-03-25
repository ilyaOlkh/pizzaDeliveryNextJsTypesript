'use client'
import { useEffect } from 'react';
import { flsModules } from "../js/files/modules.js";
import Popup from "../js/libs/popup.js"
import SelectConstructor from "../js/libs/select.js"
import DynamicAdapt from "../js/libs/dynamic_adapt.js";
import menuChecker from "../js/files/script.js";

import * as flsFunctions from "../js/files/functions.js";

export function refreshTabs() {
    flsFunctions.tabs();
}

export function refreshSpollers() {
    flsFunctions.spollers();
}

export default function StartJS() {
    let isStarted = false
    useEffect(() => {
        console.log('refresh', isStarted)
        if (!isStarted) {
            isStarted = true
            /* Модуль "Попапи" */
            console.log('Старт попапов')
            flsModules.popup = new Popup({});
            flsModules.popup._openToHash()

            flsModules.select = new SelectConstructor({});

            /* Динамічний адаптив */
            const da = new DynamicAdapt("max");
            da.init();

            /* адаптивне меню */
            menuChecker()

            /* Модуль "Спойлери" */
            flsFunctions.spollers();

            /* Модуль "Таби" */
            flsFunctions.tabs();
        }

    }, []);
    return (<></>)
}