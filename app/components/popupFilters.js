'use client'
import getFilters from '../service/getFilters'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { flsModules } from "../js/files/modules.js";
import Popup from "../js/libs/popup"
import { updateFilters } from '../service/updateFilters'


const popupFilters = dynamic(() => {
    return new Promise((resolve) => {
        resolve(({ type }) => {
            const [filters, setFilters] = useState([]);
            useEffect(() => {
                flsModules.popup = new Popup({});
                flsModules.popup._openToHash()
            }, []);
            useEffect(() => {
                const fetchFilters = async () => {
                    const filters = await getFilters(type);
                    console.log(filters)
                    setFilters(filters);
                };
                fetchFilters();
            }, []);
            return (<div id="filters" aria-hidden="true" className="popup filters">
                <div className="popup__wrapper">
                    <form acceptCharset="ISO-8859-1" action={updateFilters} method="get" className="popup__content filters__body">
                        <div className="filters__header popup__header"><span className="filters__title popup__title">Фильтры</span>
                            <button data-close="data-close" type="button" className="popup__close">
                                <img src="/Common/Cross.svg" alt="Cross" />
                            </button>
                        </div>
                        <div className="filters__checks">
                            {
                                filters.map((block) => {
                                    return (
                                        <div className="filters__block">
                                            <div className="filters__block-title">{block.i_type}</div>
                                            <div className="filters__options">
                                                {
                                                    block.i_name.split(',').map((elem) => {
                                                        return (

                                                            <label className="filters__option">
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
                        <div className="filters__buttons">
                            <input type="reset" value="Сбросить" />
                            <input type="submit" value="Применить" />
                        </div>
                    </form>
                </div>
            </div>);
        }
        );
    });

}, { ssr: false });

export default popupFilters;