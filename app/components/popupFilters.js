'use client'
import getFilters from '../service/getFilters'
import { useEffect, useState } from 'react';
import { updateFilters } from '../service/updateFilters'


const HTMLLoading = (
    <div className='popup-from-left__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

export default function popupFilters({ type }) {
    const [filters, setFilters] = useState([]);
    let content;
    let uniqueKeyLable = 0
    let uniqueDivKey = 0
    useEffect(() => {
        console.log('фильтры отрендерены')
        const fetchFilters = async () => {
            const filters = await getFilters(type);
            setFilters(filters);
        };
        fetchFilters();
    }, []);
    if (filters.length == 0) {
        content = HTMLLoading
    } else {
        content = (
            <div className="popup-from-left__inner">
                {
                    filters.map((block) => {
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
                                                    <input id={elem} type="checkbox" name={encodeURIComponent(block.i_type)} value={encodeURIComponent(elem)} style={{ display: 'none' }} /><span id="word_opts">{elem}</span>
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
    return (<div id="filters" aria-hidden="true" className="popup popup-from-left">
        <div className="popup__wrapper">
            <form action={updateFilters} method="POST" className="popup__content popup-from-left__body">
                <div className="popup-from-left__header popup__header">
                    <span className="popup-from-left__title popup__title">Фильтры</span>
                    <button data-close="data-close" type="button" className="popup__close">
                        <img src="/Common/Cross.svg" alt="Cross" />
                    </button>
                </div>
                {content}
                <div className="popup-from-left__buttons">
                    <input type="reset" value="Сбросить" />
                    <input type="submit" value="Применить" />
                </div>
            </form>
        </div >
    </div >);
}