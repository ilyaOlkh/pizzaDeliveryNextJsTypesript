'use client'
import { useEffect } from 'react';
import { flsModules } from "../js/files/modules.js";
import Popup from "../js/libs/popup.js"
import SelectConstructor from "../js/libs/select.js"
import DynamicAdapt from "../js/libs/dynamic_adapt.js";
import menuChecker from "../js/files/script.js";
import { initSliders } from "@/app/js/files/sliders.js";

import * as flsFunctions from "../js/files/functions.js";

import * as flsScroll from "../js/files/scroll/scroll.js";


export function refreshTabs() {
    flsFunctions.tabs();
}

export function refreshSpollers() {
    flsFunctions.spollers();
}

export function refreshSelect() {
    flsModules.select = new SelectConstructor({});
}

export default function StartJS() {
    let isStarted = false
    useEffect(() => {
        if (!isStarted) {
            isStarted = true
            /* Перевірка підтримки webp, додавання класу webp або no-webp для HTML */
            flsFunctions.isWebp();

            /* Модуль "Попапи" */
            console.log('Старт попапов')
            flsModules.popup = new Popup({});
            flsModules.popup._openToHash()
            console.log(1111)

            /* Модуль роботи з select. */
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

            /*Налаштування підключення плагіна слайдера Swiper та нових слайдерів виконується у файлі js/files/sliders.js*/
            initSliders();

            // Плавна навігація по сторінці
            flsScroll.pageNavigation();

            // Функціонал додавання класів до хедеру під час прокручування
            flsScroll.headerScroll();
        }

    }, []);
    return (<></>)
}