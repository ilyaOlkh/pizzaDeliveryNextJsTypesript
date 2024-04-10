'use client'

import Header from "../header/page"

import { useContext, useEffect, useState, useRef } from "react"
import { MyContext } from "../context/contextProvider"
import { getOrders } from "../service/getOrders"
import OrderItem from "../ui/orderItem"
import getOrdersProductsByIDs from "../service/getOrdersProductsByIDs"
import { Pagination } from "@mui/material";
import PopupOrder from "../components/PopupOrder"
import PopupSort from "../components/PopupSort"
import PopupFilters from "../components/popupFilters"

import { OrdersContext, OrdersDetailsContext, isAdminContext, sortContext } from "../context/contextProvider"

const HTMLLoading = (
    <div className='error__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

export default function ClientPersonalPage({ searchParams, numOfPages, filters }) {
    const [page, setPage] = useState(searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE])
    const { userState, setUser } = useContext(MyContext)
    const { ordersState, setOrders } = useContext(OrdersContext)
    const { isAdminState, setIsAdmin } = useContext(isAdminContext)
    const { ordersDetailsState, setOrdersDetails } = useContext(OrdersDetailsContext)
    const { sortState, setSort } = useContext(sortContext);
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

            pageRef.current = page
            updateOrders()
            console.log(page)
            setPageParam()

        }
    }, [page, sortState])

    function handleChange(event, page) {
        setPage(page)
    }
    function setPageParam() {
        let idForPage = process.env.NEXT_PUBLIC_ID_FOR_PAGE
        let previousParams = window.location.search
        const params = new URLSearchParams(previousParams)
        params.set(idForPage, page)
        history.pushState({}, '', `?${params}`)
    }
    return <>
        {(ordersState != 'no access' && userState && !loadingState && Object.keys(ordersState).length > 0) ? <PopupOrder /> : <></>}
        {(ordersState != 'no access' && userState && Object.keys(ordersState).length > 0) ? <PopupSort /> : <></>}
        {(ordersState != 'no access' && userState && Object.keys(ordersState).length > 0) ? <PopupFilters filtersContent={JSON.parse(process.env.NEXT_PUBLIC_SORTS_ORDER)} /> : <></>}
        <Header />
        <main className="page">
            <section className="personal">
                <div className="personal__container">
                    <div className="personal__orders">
                        {(ordersState != 'no access' && userState && !loadingState && Object.keys(ordersState).length > 0) ?
                            <div className="personal__buttons">
                                <button type="button" data-popup="#filters" className="button button_white">
                                    <img src="/Common/Filter.svg" alt="Filter" width={20} height={20} /><span>Фільтри</span>
                                </button>
                                <button type="button" data-popup="#sort" className="button button_white">
                                    <img src="/Common/Sort.svg" alt="sort" width={20} height={20} /><span>Сортування</span>
                                </button>
                            </div> : <></>
                        }
                        {ordersState != 'no access' ?
                            (userState ? (
                                loadingState ?
                                    <div className="error">{HTMLLoading}</div> :
                                    (Object.keys(ordersState).length > 0 ?
                                        Object.entries(ordersState).map(([id, item]) => {
                                            return (
                                                <OrderItem orderData={item} orderProductsData={ordersDetailsState[item.order_id]} />
                                            )
                                        }) :
                                        <div className="error">
                                            <span className="error__code">Немає замовлень</span>
                                        </div>)
                            ) :
                                <div className="error">
                                    <span className="error__code">вы не вошли в аккаунт</span>
                                </div>)
                            :
                            <div className="error">
                                <span className="error__code">нет доступа</span>
                            </div>
                        }
                    </div>
                    {
                        (numOfPages && numOfPages > 1 && ordersState != 'no access' && userState && !loadingState && Object.keys(ordersState).length > 0) ? <div className="personal__pagination"><Pagination defaultPage={+page} hidePrevButton hideNextButton count={+numOfPages} onChange={handleChange} /></div> : <></>
                    }

                </div>
            </section>
        </main>
    </>
}