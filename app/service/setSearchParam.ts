'use client'
export function setParam(paramName: string, value: string) {
    let previousParams = window.location.search
    const params = new URLSearchParams(previousParams)
    params.set(paramName, value)
    history.pushState({}, '', `?${params}`)
}