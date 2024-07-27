'use client'
// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules";

/////////////


export default function menuChecker() {
    let elCount, elems, elemsMove, widthH, parentGap, listGap, lastcurrentW
    let parent = document.querySelector('.header__row:nth-child(1n+2)')
    let menu = parent.querySelector('.menu')
    let list = menu.querySelector('.menu__list')
    let basket = parent.querySelector('.header__basket')
    let menuMore = list.querySelector('.menu__more')
    lastcurrentW = document.documentElement.clientWidth
    updateVar()
    function updateVar() {

        listGap = window.getComputedStyle(list, null).getPropertyValue("gap").split('px')[0]
        parentGap = window.getComputedStyle(parent, null).getPropertyValue("gap").split('px')[0];
        let menuGap = window.getComputedStyle(menu, null).getPropertyValue("gap").split('px')[0]
        let logo = menu.querySelector('.menu__logo')
        widthH = list.clientWidth + logo.clientWidth + +menuGap + basket.clientWidth + +parentGap + 30
        elCount = 2
        elems = []
        elemsMove = []
        while (widthH > 767) {
            let lastElem = list.childNodes[list.childNodes.length - elCount]
            elems.push([lastElem, widthH])
            widthH -= lastElem.getBoundingClientRect().width + +listGap
            elCount++
        }
    }
    function onResize() {
        let currentW = document.documentElement.clientWidth
        if (currentW > 767) {
            if (lastcurrentW <= 767) {
                window.addEventListener("load", function () {
                    console.log("Все стили подгружены!");
                });
                updateVar()
            }
            while (elems[0] && currentW < elems[0][1]) {
                menuMore.insertBefore(elems[0][0], menuMore.childNodes[0])
                elemsMove.push(elems.shift())
            }
            while (elemsMove[0] && currentW > elemsMove[elemsMove.length - 1][1]) {
                list.insertBefore(elemsMove[elemsMove.length - 1][0], list.childNodes[list.childNodes.length - 1])
                elems.unshift(elemsMove.pop())
            }
        } else {
            while (elemsMove[0]) {
                list.insertBefore(elemsMove[elemsMove.length - 1][0], list.childNodes[list.childNodes.length - 1])
                elems.unshift(elemsMove.pop())
            }
        }
        lastcurrentW = currentW
    }
    onResize()
    window.addEventListener("resize", onResize)
}
