export interface ISort {
    sortRule: string
    direction: 'desc' | 'asc'
}

export interface ISortParam {
    sortRule: string
    value: string
}