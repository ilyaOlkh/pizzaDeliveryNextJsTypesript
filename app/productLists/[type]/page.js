import getProductTypes from '../../service/getProductTypes'
import getIngredientsTypes from '../../service/getIngredientsTypes'
// import Image from "next/image";

import getProducts from '../../service/getProducts.js'
import getFilters from '@/app/service/getFilters'
import { GetUserInfoForServer } from '@/app/AuthControllers/GetDataController';
import { SortProvider } from '@/app/context/contextProvider'
import ClientPage from './clientPage'

const i_types = await getIngredientsTypes()
const sortRuleId = process.env.NEXT_PUBLIC_SORT_PARAM
const sortParams = [
    { sortRule: "product_id", value: "Номер" },
    { sortRule: "rating", value: "Рейтинг" },
]

export default async function productList(params) {
    //------авторизация----------
    const user = await GetUserInfoForServer();
    //-------фильтрация----------
    let decodedContent = {};
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
    const sort = { sortRule: params.searchParams[sortRuleId] || 'product_id', direction: params.searchParams[process.env.NEXT_PUBLIC_DIR_PARAM] || 'asc' }
    console.log(params.searchParams[sortRuleId])
    let type = decodeURIComponent(params.params.type)
    const filtersContent = await getFilters(type);

    let products = await getProducts({
        type: type,
        filters: (Object.keys(filters).length !== 0 ?
            (type != 'піца' ? { ...filters, size_sm: 'null' } : filters)
            : undefined),
        sort: sort
    })
    let ProductTypes = await getProductTypes()
    return (
        <>
            <SortProvider sort={sort}>
                <ClientPage filters={filters} ProductTypes={ProductTypes} products={products} type={type} filtersContent={filtersContent} sortParams={sortParams} params={params} />
            </SortProvider>
        </>
    )
}