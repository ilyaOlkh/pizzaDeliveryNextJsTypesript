'use client'

window['FLS'] = true;

import * as flsFunctions from "./files/functions.js";

flsFunctions.menuInit();

import * as flsScroll from "./files/scroll/scroll.js";

let links = document.querySelectorAll('.categories__category_notWorking');
links.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
    });
});
