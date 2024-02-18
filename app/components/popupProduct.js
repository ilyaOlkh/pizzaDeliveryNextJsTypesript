'use client'
import React, { useEffect } from 'react';
export default function popupProduct() {
    // function click() {
    //     console.log('click')
    // }
    // useEffect(() => {
    //     console.log(1)
    //     console.log(document.querySelector('#card'))
    //     document.querySelector('#card').addEventListener('beforePopupOpen', click);

    //     return () => {
    //         document.querySelector('#card').removeEventListener('beforePopupOpen', click);
    //     };
    // }, []);
    return (
        <div id="card" aria-hidden="true" class="popup card">
            <div class="popup__wrapper card__wrapper">
                <div class="popup__content card__content">
                    <div class="card__header popup__header"><span class="card__title popup__title">Фильтры</span>
                        <button data-close="data-close" type="button" class="popup__close">
                            <img src="/Common/Cross.svg" alt="Cross" />
                        </button>
                    </div>
                    <div class="card__body">
                        <div class="card__img"><img src="/pizzas/pizza1.png/" alt="pizza" /></div>
                        <div class="card__info">
                            <div class="card__title-product">
                                <img src="@img/Common/Fire.svg" alt="Fire" /><span>Пепперони по-деревенски</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}