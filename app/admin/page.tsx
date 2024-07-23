import redirectUrl from "../service/redirect"
import { getOrders } from "../service/getOrders"
import getOrdersProductsByIDs from "../service/getOrdersProductsByIDs"
import ClientPersonalPage from "./clientPage"

import { getNumOfPages } from "../service/getNumOfPages"
import { GetUserInfoForServer } from "../AuthControllers/GetDataController"

import { UserProviders, SortProvider } from "../context/contextProvider"
import React from "react"

import { TypeOrderDetails } from "../types/OrderDetails"

import { IParams, TypeFilters } from "../types/types"

import { checkSortDir } from "../service/checkParams"
import { TypeOrders } from "../types/order"

interface ISortRule {
    sortRule: string;
    direction: 'asc' | 'desc';
}



const sortRuleId = process.env.NEXT_PUBLIC_SORT_PARAM

export default async function personalPage(params: IParams) {
    ///////// фильтры
    let decodedContent: TypeFilters = {};
    for (let key in params.searchParams) {
        let decodedKey: string = decodeURIComponent(key);
        if (!process.env.NEXT_PUBLIC_ALL_SORTS_RULES.split(', ').includes(decodedKey)) {
            continue
        }
        let decodedValue: string = decodeURIComponent(params.searchParams[key]);
        decodedContent[decodedKey] = decodedValue;
    }
    const filters: TypeFilters = decodedContent
    /////////

    const userData = await GetUserInfoForServer()
    let NumOfPages = Math.ceil((userData[0] ? (await getNumOfPages(undefined, Object.keys(filters).length > 0 ? filters : undefined)) : 1) / +process.env.NEXT_PUBLIC_NUM_IN_PAGE)
    NumOfPages = NumOfPages === 0 ? 1 : NumOfPages

    if (!params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] ||
        +params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] < 1 ||
        +params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] > NumOfPages ||
        !+params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE]) {
        params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] = '1'
        await redirectUrl(`?${new URLSearchParams(params.searchParams)}`)
    }

    let sort: ISortRule = { sortRule: params.searchParams[sortRuleId] || 'order_date_time', direction: checkSortDir(params.searchParams[process.env.NEXT_PUBLIC_DIR_PARAM]) || 'desc' }
    let orders: TypeOrders | 'error' | 'no access' = await getOrders(+params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE], +process.env.NEXT_PUBLIC_NUM_IN_PAGE, true, sort, Object.keys(filters).length > 0 ? filters : undefined) || []
    let OrdersProducts: TypeOrderDetails = [];
    if (Object.keys(orders).length > 0) {
        OrdersProducts = await getOrdersProductsByIDs()
    }
    return (
        <UserProviders orders={orders} ordersDetails={OrdersProducts} isAdmin={userData[3] === 'admin'} >
            <SortProvider sort={sort}>
                <ClientPersonalPage searchParams={params.searchParams} numOfPages={NumOfPages} filters={Object.keys(filters).length > 0 ? filters : undefined} />
            </SortProvider>
        </UserProviders>
    )
}