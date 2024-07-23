'use client'
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PriceFilter({ type, selectedSize, setSelectedSize }) {
    let params = useSearchParams()

    let uniqueKeyLable = 0;

    const handleChange = (event) => {
        if (decodeURIComponent(event.target.value) != selectedSize) {
            setSelectedSize(decodeURIComponent(event.target.value));
        } else {
            setSelectedSize(null)
        }
    };
    return <>
        {type == 'піца' ?
            <div className="popup-from-left__block">
                <div className="popup-from-left__block-title">розмір</div>
                <div className="popup-from-left__options">
                    {'20см, 28см, 33см'.split(', ').map((elem) => {
                        uniqueKeyLable++
                        return (
                            <label className="popup-from-left__option" key={uniqueKeyLable}>
                                <input onClick={handleChange} id={elem} type='radio' defaultChecked={false} checked={selectedSize == elem} name='size_sm' value={encodeURIComponent(elem)} style={{ display: 'none' }} /><span id="word_opts">{elem}</span>
                            </label>
                        )
                    })}
                </div>
            </div> : <></>
        }
        <div className="popup-from-left__block">
            <div className="popup-from-left__block-title">мінімальна ціна</div>
            <div className="popup-from-left__options">
                <input className="popup-from-left__option-input" disabled={!selectedSize} defaultValue={params.getAll('priceFrom')} placeholder={selectedSize ? 'мінімальна ціна' : 'Оберіть розмір'} type='number' name='priceFrom' />
            </div>
        </div>
        <div className="popup-from-left__block">
            <div className="popup-from-left__block-title">максимальна ціна</div>
            <div className="popup-from-left__options">
                <input className="popup-from-left__option-input" disabled={!selectedSize} defaultValue={params.getAll('priceTo')} placeholder={selectedSize ? 'максимальна ціна' : 'Оберіть розмір'} type='number' name='priceTo' />
            </div>
        </div>
    </>
}