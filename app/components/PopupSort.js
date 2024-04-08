'use client'
import getFilters from '../service/getFilters'
import { useEffect, useState, useContext } from 'react';
import { updateFilters } from '../service/updateFilters'
import { sortContext } from '../context/contextProvider';


const HTMLLoading = (
    <div className='popup-from-left__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

export default function PopupSort() {
    const [filters, setFilters] = useState([]);
    const { sortState, setSort } = useContext(sortContext);
    console.log(sortState)
    let content;
    let uniqueKeyLable = 0
    let uniqueDivKey = 0

    const sortParams = [
        { sortRule: "order_id", value: "Номер замовлення" },
        { sortRule: "order_date_time", value: "час" },
        { sortRule: "status", value: "статус" },
        { sortRule: "count(order_details_id)", value: "Кількість унікальних продуктів" },
        { sortRule: "sum(quantity)", value: "Кількість продуктів" },
        { sortRule: "sum(selled_price*quantity)", value: "Загальна ціна" },
        { sortRule: "first_name || ' ' || last_name", value: "замовник" },
        { sortRule: "payment", value: "Оплата" },
        { sortRule: "delivery", value: "Тип доставки" },
    ]

    function updateSort(event) {
        event.preventDefault()
    }

    function handleClick(event) {
        event.preventDefault()
        const newSortRule = event.target.closest('button').dataset.sortRule
        let newSortDir = 'asc'
        console.log(newSortRule, 'hf')
        if (sortState.sortRule == newSortRule) {
            console.log('hf')
            if (sortState.direction == 'asc') {
                newSortDir = 'desc'
            } else {
                newSortDir = 'asc'
            }
        }
        console.log(sortState)
        setSort({ sortRule: newSortRule, direction: newSortDir })
    }

    return (<div id="sort" aria-hidden="true" className="popup popup-from-left">
        <div className="popup__wrapper">
            <form onSubmit={updateSort} method="POST" className="popup__content popup-from-left__body">
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
            </form>
        </div >
    </div >);
}