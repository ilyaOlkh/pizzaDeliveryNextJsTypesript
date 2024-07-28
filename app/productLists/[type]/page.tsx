import getProductTypes from '../../service/getProductTypes'
import getIngredientsTypes from '../../service/getIngredientsTypes'
// import Image from "next/image";

import getProducts from '../../service/getProducts'
import getFilters from '@/app/service/getFilters'
import { SortProvider } from '@/app/context/contextProvider'
import ClientPage from './clientPage'
import { IParams } from '@/app/types/types'
import { IFilter } from '@/app/types/filters'
import { Database } from '@/app/types/databaseSchema'
import { ISort } from '@/app/types/sort'
import { IProduct } from '@/app/types/products'

const i_types = await getIngredientsTypes()
const sortRuleId = process.env.NEXT_PUBLIC_SORT_PARAM
const sortParams = [
    { sortRule: "product_id", value: "Номер" },
    { sortRule: "rating", value: "Рейтинг" },
]

export default async function productList(params: IParams) {
    //-------фильтрация----------
    let decodedContent: { [key: string]: string } = {};
    for (let key in params.searchParams) {
        let decodedKey = decodeURIComponent(key);
        if (!i_types.includes(decodedKey) && !process.env.NEXT_PUBLIC_FILTERS_SPECIAL_PARAMS.split(', ').includes(decodedKey)) {
            continue
        }
        let decodedValue = decodeURIComponent(params.searchParams[key]);
        decodedContent[decodedKey] = decodedValue;
    }
    const filters = decodedContent
    //-------сортировка----------
    const sort: ISort = {
        sortRule: params.searchParams[sortRuleId] || 'product_id',
        direction: params.searchParams[process.env.NEXT_PUBLIC_DIR_PARAM] === 'desc' ? 'desc' : 'asc'
    }
    console.log(params)
    let type = decodeURIComponent(params.params.type)
    let filtersContent: IFilter[] = []
    let products: IProduct[] = []
    if (isPType(type)) {
        filtersContent = await getFilters(type);
        filtersContent.unshift({
            filterRule: 'searchName', i_type: 'назва', i_name: '', ui: 'custom',
            customUI: <input pattern="^[А-ЩЬЮЯҐІЇЄа-щьюяґіїє]{1,500}$" className="popup-from-left__option-input" defaultValue={params.searchParams['searchName']} placeholder='назва' type='text' name='searchName' />
        })

        products = await getProducts({
            type: type,
            filters: (Object.keys(filters).length !== 0 ?
                (type != 'піца' ? { ...filters, size_sm: 'null' } : filters)
                : undefined),
            sort: sort
        })
    }
    let ProductTypes = await getProductTypes()
    return (
        <>
            <SortProvider sort={sort}>
                <ClientPage filters={filters} ProductTypes={ProductTypes} products={products} type={type} filtersContent={filtersContent} sortParams={sortParams} />
            </SortProvider>
        </>
    )
}


function isPType(type: string): type is Database['product']['p_type'] {
    if (type === "піца" || type === "суші" || type === "напої" || type === "закуски" || type === "десерти" || type === "соуси") {
        return true
    }
    return false
}