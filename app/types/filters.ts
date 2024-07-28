import { MouseEventHandler } from "react"

export interface IFilter {
    filterRule?: string
    i_type: string
    i_name: string
    ui?: string
    customUI?: JSX.Element
    onClick?: MouseEventHandler<HTMLInputElement>
}