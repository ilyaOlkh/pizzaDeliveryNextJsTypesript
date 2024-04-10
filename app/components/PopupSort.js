'use client'
import { useState, useContext } from 'react';
import { sortContext } from '../context/contextProvider';


const HTMLLoading = (
    <div className='popup-from-left__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

export default function PopupSort({ sortParams }) {
    const [filters, setFilters] = useState([]);
    const { sortState, setSort } = useContext(sortContext);

    function handleClick(event) {
        event.preventDefault()
        const newSortRule = event.target.closest('button').dataset.sortRule
        let newSortDir = 'asc'
        if (sortState.sortRule == newSortRule) {
            if (sortState.direction == 'asc') {
                newSortDir = 'desc'
            } else {
                newSortDir = 'asc'
            }
        }
        setSort({ sortRule: newSortRule, direction: newSortDir })
    }

    return (<div id="sort" aria-hidden="true" className="popup popup-from-left">
        <div className="popup__wrapper">
            <div className="popup__content popup-from-left__body">
                <div className="popup-from-left__header popup__header">
                    <span className="popup-from-left__title popup__title">Сортування</span>
                    <button data-close="data-close" type="button" className="popup__close">
                        <img src="/Common/Cross.svg" alt="Cross" />
                    </button>
                </div>
                <div className="popup-from-left__inner">
                    <div className="popup-from-left__block">
                        {
                            sortParams.map((item) => {
                                return (<button onClick={handleClick} data-sort-rule={item.sortRule} className="popup-from-left__button-wrapper button button_white">
                                    <div className="popup-from-left__button-sort">
                                        {item.value}
                                        {sortState.sortRule == item.sortRule ? <img className={sortState.direction == 'desc' ? "reversed" : ""} src="/Common/triangle.svg" alt="triangle" /> : <></>}
                                    </div>
                                </button>)
                            })
                        }

                    </div>
                </div>
            </div>
        </div >
    </div >);
}