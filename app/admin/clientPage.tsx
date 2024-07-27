'use client'

import Header from "../header/page"

import React, { useEffect, useState, useRef, ChangeEvent } from "react"
import { MyContext } from "../context/contextProvider"
import { getOrders } from "../service/getOrders"
import OrderItem from "../ui/orderItem"
import getOrdersProductsByIDs from "../service/getOrdersProductsByIDs"
import { Pagination } from "@mui/material";
import PopupOrder from "../components/PopupOrder"
import PopupSort from "../components/PopupSort"
import PopupFilters from "../components/popupFilters"
import { IParams, TypeFilters } from "../types/types"

import { OrdersContext, OrdersDetailsContext, isAdminContext, sortContext } from "../context/contextProvider"
import { useSafeContext } from "../service/useSafeContext"
import ErrorBlock from "../ErrorBlock/ErrorBlock"
import { ISortParam } from "../types/sort"



const HTMLLoading: JSX.Element = (
    <div className='error__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

const sortParams: ISortParam[] = [
    { sortRule: "order_id", value: "Номер замовлення" },
    { sortRule: "order_date_time", value: "Час" },
    { sortRule: "status", value: "Статус" },
    { sortRule: "count(order_details_id)", value: "Кількість унікальних продуктів" },
    { sortRule: "sum(quantity)", value: "Кількість продуктів" },
    { sortRule: "sum(selled_price*quantity)", value: "Загальна ціна" },
    { sortRule: "first_name || ' ' || last_name", value: "Замовник" },
    { sortRule: "payment", value: "Оплата" },
    { sortRule: "delivery", value: "Тип доставки" },
]

export default function ClientPersonalPage({ searchParams, numOfPages, filters }: { searchParams: IParams["searchParams"], numOfPages: number, filters?: TypeFilters }) {

    const { userState, setUser } = useSafeContext(MyContext, 'userContext')
    const { ordersState, setOrders } = useSafeContext(OrdersContext, "OrdersContext")
    const { isAdminState, setIsAdmin } = useSafeContext(isAdminContext, 'isAdminContext')
    const { ordersDetailsState, setOrdersDetails } = useSafeContext(OrdersDetailsContext, 'OrdersDetailsContext')
    const { sortState, setSort } = useSafeContext(sortContext, 'sortContext');

    const [page, setPage] = useState<number>(+searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE])
    const [loadingState, setLoading] = useState(false)

    const userStateRef = useRef(userState);
    const pageRef = useRef(page);
    const sortRef = useRef(sortState);


    const updateOrders = async () => {
        console.log('rerender')
        setLoading(true)
        let orders = await getOrders(+page, +process.env.NEXT_PUBLIC_NUM_IN_PAGE, true, sortState, filters) || []
        let ordersProducts = await getOrdersProductsByIDs() || []
        if (userState && userState.role === 'admin') {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
        setOrdersDetails(ordersProducts)
        setOrders(orders)
        setLoading(false)
    }
    useEffect(() => {
        if (userStateRef.current != userState) {
            console.log('rerender')
            userStateRef.current = userState
            updateOrders()
        }
    }, [userState])
    useEffect(() => {
        if (pageRef.current != page || sortRef.current != sortState) {
            console.log('rerender')
            sortRef.current = sortState
            pageRef.current = page
            updateOrders()
            setPageParam()

        }
    }, [page, sortState])

    function handleChange(event: ChangeEvent<unknown>, page: number) {
        setPage(page)
    }
    function setPageParam() {
        let idForPage = process.env.NEXT_PUBLIC_ID_FOR_PAGE
        let previousParams = window.location.search
        const params = new URLSearchParams(previousParams)
        params.set(idForPage, page.toString())
        history.pushState({}, '', `?${params}`)
    }
    const renderContent = () => {
        if (!userState) {
            return <ErrorBlock><span className="error__code">ви не увійшли в акаунт</span></ErrorBlock>;
        }
        if (loadingState) {
            return <ErrorBlock>{HTMLLoading}</ErrorBlock>;
        }
        if (ordersState === 'no access') {
            return <ErrorBlock><span className="error__code">немає доступу адміна</span></ErrorBlock>;
        }
        if (Object.keys(ordersState).length === 0) {

            return <ErrorBlock withButtons={true}><span className="error__code">Немає замовлень</span></ErrorBlock>;
        }
        if (ordersState === 'error') {
            return <ErrorBlock><span className="error__code">виникла помилка</span></ErrorBlock>;
        }

        return <>
            <div className="personal__orders">
                <div className="personal__buttons">
                    <button type="button" data-popup="#filters" className="button button_white">
                        <img src="/Common/Filter.svg" alt="Filter" width={20} height={20} /><span>Фільтри</span>
                    </button>
                    <button type="button" data-popup="#sort" className="button button_white">
                        <img src="/Common/Sort.svg" alt="sort" width={20} height={20} /><span>Сортування</span>
                    </button>
                </div>
                {Object.entries(ordersState).map(([id, item]) => (
                    <OrderItem key={item.order_id} orderData={item} orderProductsData={ordersDetailsState[item.order_id]} />
                ))}
            </div>
            {numOfPages > 1 && (
                <div className="personal__pagination">
                    <Pagination defaultPage={+page} hidePrevButton hideNextButton count={+numOfPages} onChange={handleChange} />
                </div>
            )}
        </>
    };

    return <>
        {(ordersState != 'error' && ordersState != 'no access' && userState && !loadingState && Object.keys(ordersState).length > 0) ? <PopupOrder /> : <></>}
        {(ordersState != 'error' && ordersState != 'no access' && userState) ? <PopupSort sortParams={sortParams} /> : <></>}
        {(ordersState != 'error' && ordersState != 'no access' && userState) ? <PopupFilters filtersContent={JSON.parse(process.env.NEXT_PUBLIC_SORTS_ORDER)} /> : <></>}
        <Header />
        <main className="page">
            <section className="personal">
                <div className="personal__container">
                    {renderContent()}
                </div>
            </section>
        </main>
    </>
}