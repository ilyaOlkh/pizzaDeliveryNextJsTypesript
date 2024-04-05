'use client'
export function setParam(paramName, value) {
    let previousParams = window.location.search
    const params = new URLSearchParams(previousParams)
    params.set(paramName, value)
    history.pushState({}, '', `?${params}`)
}