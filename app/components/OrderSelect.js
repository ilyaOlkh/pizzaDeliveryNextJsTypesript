'use client'
import { useEffect, useState } from "react"
import { refreshSelect } from "./startJS"

export default function OrderSelect({ statusArray, status, id, name }) {
    const [statusState, setStatus] = useState(status)
    console.log(status, statusState)
    useEffect(() => {
        // refreshSelect()
        const thisSelect = document.querySelector(`select[name='${name}']`)
        console.log(status)
        thisSelect.closest('.select').querySelector('.select__value').innerHTML = status

        setStatus(status)
        console.log(statusState)
        console.log(status)
    }, [statusArray, status]);
    // useEffect(() => {
    //     let func = (e) => {
    //         if (e.detail.select == thisSelect) {
    //             console.log(thisSelect.value)
    //         }
    //     }
    //     document.addEventListener('selectCallback', func)
    //     return () => { document.removeEventListener('selectCallback', func) }
    // }, []);
    return (
        <div class=" popup-order__data-select select _select-active" data-id={id}>
            <select value={statusState} name={name} data-show-selected="true" hidden data-id={id} data-speed="150">
                {
                    statusArray.map(item => <option value={item}>{item}</option>)
                }
            </select><div class="select__body">
                <button type="button" class="select__title">
                    <span class="select__value"><span class="select__content">{statusState}</span>
                    </span>
                </button>
                <div hidden class="select__options">
                    <div class="select__scroll">
                        {
                            statusArray.map(item => <button data-value={item} type="button" className="select__option">{item}</button>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}