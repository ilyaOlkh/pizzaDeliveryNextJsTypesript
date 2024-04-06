import redirectUrl from "../service/redirect"
import { getOrders } from "../service/getOrders"
import getOrdersProductsByIDs from "../service/getOrdersProductsByIDs"
import ClientPersonalPage from "./clientPage"

import { getNumOfPages } from "../service/getNumOfPages"
import { GetUserInfoForServer } from "../AuthControllers/GetDataController"

import { UserProviders } from "../context/contextProvider"

export default async function personalPage(params) {
    const userData = await GetUserInfoForServer()
    let NumOfPages = Math.ceil((userData[0] ? (await getNumOfPages()).count : 1) / process.env.NEXT_PUBLIC_NUM_IN_PAGE)

    if (!params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] ||
        params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] < 1 ||
        params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] > NumOfPages ||
        !+params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE]) {
        params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE] = '1'
        await redirectUrl(`?${new URLSearchParams(params.searchParams)}`)
    }
    let orders = await getOrders(params.searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE], process.env.NEXT_PUBLIC_NUM_IN_PAGE, true) || []
    let OrdersProducts = [];
    if (Object.keys(orders).length > 0) {
        OrdersProducts = await getOrdersProductsByIDs()
    }
    return (
        <UserProviders orders={orders} ordersDetails={OrdersProducts} isAdmin={userData[2]}>
            <ClientPersonalPage searchParams={params.searchParams} numOfPages={NumOfPages} />
        </UserProviders>
    )
}