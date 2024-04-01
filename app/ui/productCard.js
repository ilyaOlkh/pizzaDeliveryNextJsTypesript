'use client'
import Image from "next/image";
export default function ProductCard({ productData }) {
    function click() {
        let idForProduct = process.env.NEXT_PUBLIC_ID_FOR_PRODUCT
        let filters = window.location.search
        const params = new URLSearchParams(filters)
        params.get(idForProduct)
        if (params.get(idForProduct) != productData.product_id) {
            params.delete(idForProduct)
            params.append(idForProduct, productData.product_id)
            history.pushState({}, '', `?${params}#card`)
        }
    }
    return (
        <button onClick={click} type="button" data-product-id={productData.product_id} data-popup="#card" className="priceList__item priceItem" >
            <div className="priceItem__inner">
                <div className="priceItem__img"><Image src={productData.image_url.split('img')[1]} alt="pizza" width={400} height={400} /></div>
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