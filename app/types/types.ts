export interface IParams {
    params: {
        type: string
    }
    searchParams: {
        [key: string]: string
    }
}

export type TypeFilters = { [key: string]: string }