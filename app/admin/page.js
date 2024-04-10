import redirectUrl from "../service/redirect"
import { getOrders } from "../service/getOrders"
import getOrdersProductsByIDs from "../service/getOrdersProductsByIDs"
import ClientPersonalPage from "./clientPage"

import { getNumOfPages } from "../service/getNumOfPages"
import { GetUserInfoForServer } from "../AuthControllers/GetDataController"

import { UserProviders } from "../context/contextProvider"

const sortRuleId = process.env.NEXT_PUBLIC_SORT_PARAM

export default async function personalPage(params) {
    ///////// фильтры
    let decodedContent = {};
    for (let key in params.searchParams) {
        let decodedKey = decodeURIComponent(key);
        if (!process.env.NEXT_PUBLIC_ALL_SORTS_RULES.split(', ').includes(decodedKey)) {
            continue
        }
        let decodedValue = decodeURIComponent(params.searchParams[key]);
        decodedContent[decodedKey] = decodedValue;
    }
    const filters = decodedContent
    /////////

    const userData = await GetUserInfoForServer()

    let NumOfPages = Math.ceil((userData[0] ? (await getNumOfPages(undefined, Object.keys(filters).length > 0 ? filters : undefined)).count : 1) / process.env.NEXT_PUBLIC_NUM_IN_PAGE)
    NumOfPages = NumOfPages === 0 ? 1 : NumOfPages
    console.log(NumOfPages)

    if (!params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] ||
        params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] < 1 ||
        params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] > NumOfPages ||
        !+params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE]) {
        params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] = '1'
        await redirectUrl(`?${new URLSearchParams(params.searchParams)}`)
    }

    let sort = { sortRule: params.searchParams[sortRuleId] || 'order_date_time', direction: params.searchParams[process.env.NEXT_PUBLIC_DIR_PARAM] || 'desc' }
    let orders = await getOrders(params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE], process.env.NEXT_PUBLIC_NUM_IN_PAGE, true, sort, Object.keys(filters).length > 0 ? filters : undefined) || []
    let OrdersProducts = [];
    if (Object.keys(orders).length > 0) {
        OrdersProducts = await getOrdersProductsByIDs()
    }
    return (
        <UserProviders orders={orders} ordersDetails={OrdersProducts} isAdmin={userData[2]} sort={sort}>
            <ClientPersonalPage searchParams={params.searchParams} numOfPages={NumOfPages} filters={Object.keys(filters).length > 0 ? filters : undefined} />
        </UserProviders>
    )
}