'use client'

import Header from "../header/page"

import { useContext, useEffect, useState, useRef, ChangeEvent } from "react"
import { MyContext } from "../context/contextProvider"
import { getOrders } from "../service/getOrders"
import OrderItem from "../ui/orderItem"
import getOrdersProductsByIDs from "../service/getOrdersProductsByIDs"
import { Pagination } from "@mui/material";
import PopupOrder from "../components/PopupOrder"

import { OrdersContext, OrdersDetailsContext } from "../context/contextProvider"
import ErrorBlock from "../ErrorBlock/ErrorBlock"
import { IParams } from "../types/types"
import { useSafeContext } from "../service/useSafeContext"
import { TypeOrderDetails } from "../types/OrderDetails"

const HTMLLoading = (
    <div className='error__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

export default function ClientPersonalPage({ searchParams, numOfPages }: { searchParams: IParams["searchParams"], numOfPages: number }) {
    const { userState, setUser } = useSafeContext(MyContext)
    const { ordersState, setOrders } = useSafeContext(OrdersContext)
    const { ordersDetailsState, setOrdersDetails } = useSafeContext(OrdersDetailsContext)

    const [page, setPage] = useState<number>(+searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE])
    const [loadingState, setLoading] = useState(false)

    const userStateRef = useRef(userState);
    const pageRef = useRef(page);



    const updateOrders = async () => {
        setLoading(true)
        let orders = await getOrders(+page, +process.env.NEXT_PUBLIC_NUM_IN_PAGE) || []
        let ordersProducts: TypeOrderDetails = []
        if (Object.keys(orders).length > 0 && orders !== "error" && orders !== "no access") {
            ordersProducts = await getOrdersProductsByIDs(orders.map(value => value.order_id)) || []
        }
        setOrdersDetails(ordersProducts)
        setOrders(orders)
        setLoading(false)
    }
    useEffect(() => {
        if (userStateRef.current != userState) {
            userStateRef.current = userState
            updateOrders()
        }
    }, [userState])
    useEffect(() => {
        if (pageRef.current != page) {

            pageRef.current = page
            updateOrders()
            setPageParam()

        }
    }, [page])

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
            return <ErrorBlock><span className="error__code">Немає замовлень</span></ErrorBlock>;
        }
        if (ordersState === 'error') {
            return <ErrorBlock><span className="error__code">виникла помилка</span></ErrorBlock>;
        }
        return <>
            <div className="personal__orders">
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