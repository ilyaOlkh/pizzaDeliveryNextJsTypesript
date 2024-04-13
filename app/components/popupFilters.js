'use client'
import { useState } from 'react';
import { updateFilters } from '../service/updateFilters'
import { useSearchParams } from 'next/navigation';


const HTMLLoading = (
    <div className='popup-from-left__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

export default function popupFilters({ filtersContent }) {
    const [filters, setFilters] = useState(filtersContent);
    const searchParams = useSearchParams()
    let content;
    let uniqueKeyLable = 0
    let uniqueDivKey = 0
    if (filters.length == 0) {
        content = HTMLLoading
    } else {
        content = (
            <div className="popup-from-left__inner">
                {
                    filters.map((block) => {
                        let searchParam = decodeURIComponent(searchParams.getAll(encodeURIComponent(block.filterRule ? block.filterRule : block.i_type))).split(',')
                        uniqueDivKey++
                        return (
                            <div key={uniqueDivKey} className="popup-from-left__block">
                                <div className="popup-from-left__block-title">{block.i_type}</div>
                                <div className="popup-from-left__options">
                                    {
                                        block.i_name.split(', ').map((elem) => {
                                            uniqueKeyLable++
                                            return (
                                                <label className="popup-from-left__option" key={uniqueKeyLable}>
                                                    <input id={elem} type="checkbox" defaultChecked={searchParam.includes(elem)} name={encodeURIComponent(block.filterRule ? block.filterRule : block.i_type)} value={encodeURIComponent(elem)} style={{ display: 'none' }} /><span id="word_opts">{elem}</span>
                                                </label>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    function onSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target);
        updateFilters(formData, searchParams)
    }

    return (<div id="filters" aria-hidden="true" className="popup popup-from-left">
        <div className="popup__wrapper">
            <form onSubmit={onSubmit} method="POST" className="popup__content popup-from-left__body">
                <div className="popup-from-left__header popup__header">
                    <span className="popup-from-left__title popup__title">Фільтри</span>
                    <button data-close="data-close" type="button" className="popup__close">
                        <img src="/Common/Cross.svg" alt="Cross" />
                    </button>
                </div>
                {content}
                <div className="popup-from-left__buttons">
                    <input type="reset" value="Скинути" />
                    <input type="submit" value="Застосувати" />
                </div>
            </form>
        </div >
    </div >);
}