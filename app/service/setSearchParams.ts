'use client'

type TypeParam = Record<string, string>

export function setParams(obj: TypeParam): void {
    let previousParams = window.location.search
    const params = new URLSearchParams(previousParams)
    Object.entries(obj).map(([item, value]) => {
        params.set(item, value.toString())
    })
    history.pushState({}, '', `?${params}`)
}