'use client'
import { useEffect, useState, useRef } from "react"
import { refreshSelect } from "./startJS"

type TypeStatus = 'готується' | 'доставляється' | 'доставлено' | 'скасовано'

export default function OrderSelect({ statusArray, status, id, name, isLast = false }: { statusArray: string[], status: string, id: number, name: string, isLast?: boolean }): JSX.Element { // id єто просто порядковый номер селекта на странице
    const [statusState, setStatus] = useState<string>(status)
    const onceRendered = useRef(false)
    useEffect(() => {
        const thisSelect: HTMLSelectElement | null = document.querySelector(`select[name='${name}']`)
        if (thisSelect) {
            thisSelect.value = status
            const thisPseudoSelectParent: Element | null = thisSelect.closest('.select')

            if (thisPseudoSelectParent) {
                const thisPseudoSelect: Element | null = thisPseudoSelectParent.querySelector('.select__value')

                if (thisPseudoSelect) {
                    thisPseudoSelect.innerHTML = status
                } else {
                    alert('thisPseudoSelect не знайдено')
                }
            } else {
                alert('thisPseudoSelectParent не знайдено')
            }
        } else {
            alert(`select[name='${name}'] не знайдено`)
        }
        setStatus(status)
    }, [statusArray, status]);
    useEffect(() => {
        if (!onceRendered.current && isLast) {
            refreshSelect()
            onceRendered.current = true
        }
    }, []);
    return (
        <div className=" popup-order__data-select select _select-active" data-id={id}>
            <select defaultValue={statusState} name={name} data-show-selected="true" hidden data-id={id} data-speed="150">
                {
                    statusArray.map((item, index) => <option key={index} value={item}>{item}</option>)
                }
            </select><div className="select__body">
                <button type="button" className="select__title">
                    <span className="select__value"><span className="select__content">{statusState}</span>
                    </span>
                </button>
                <div hidden className="select__options">
                    <div className="select__scroll">
                        {
                            statusArray.map((item, index) => <button key={index} data-value={item} type="button" className="select__option">{item}</button>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}