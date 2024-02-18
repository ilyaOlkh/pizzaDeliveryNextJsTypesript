'use client'
import Image from "next/image";
import { settings } from '@/app/settings';
import React, { useEffect } from "react";
export default function ProductCard({ productData }) {
    function click() {
        let filters = window.location.search
        const params = new URLSearchParams(filters)
        params.get(settings.idForProduct)
        if (params.get(settings.idForProduct) != productData.product_id) {
            params.delete(settings.idForProduct)
            params.append(settings.idForProduct, productData.product_id)
            history.pushState({}, '', `?${params}#card`)
        }
    }
    return (
        <button onClick={click} type="button" data-product-id={productData.product_id} data-popup="#card" className="priceList__item priceItem" >
            <div className="priceItem__inner">
                <div className="priceItem__img"><img src={productData.image_url.split('img')[1]} alt="pizza" /></div>
                <div className="priceItem__info">
                    <h2 className="priceItem__name"> <span>{productData.p_name}</span></h2>
                    <div className="priceItem__composition">{productData.composition}</div>
                    <div className="priceItem__row">
                        <div className="priceItem__select button">Выбрать</div>
                        <div className="priceItem__price">от 100 ₴</div>
                    </div>
                </div>
            </div>
        </button >
    )
}