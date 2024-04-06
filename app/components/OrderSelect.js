'use client'
import { useEffect } from "react"
import { refreshSelect } from "./startJS"

export default function OrderSelect({ statusArray, status, id, name }) {
    useEffect(() => {
        refreshSelect()
    }, [statusArray, status]);
    return (
        // <select value={status} name="status" data-show-selected >
        //     {
        //         statusArray.map(item => <option value={item}>{item}</option>)
        //     }
        // </select>
        <div class=" popup-order__data-select select _select-active" data-id={id}>
            <select value={status} name={name} data-show-selected="true" hidden data-id={id} data-speed="150">
                {
                    statusArray.map(item => <option value={item}>{item}</option>)
                }
            </select><div class="select__body">
                <button type="button" class="select__title">
                    <span class="select__value"><span class="select__content">{status}</span>
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