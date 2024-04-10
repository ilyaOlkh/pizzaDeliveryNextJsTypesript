'use client'
export function setParams(obj) {
    let previousParams = window.location.search
    const params = new URLSearchParams(previousParams)
    Object.entries(obj).map(([item, value]) => {
        params.set(item, value)
    })
    history.pushState({}, '', `?${params}`)
}