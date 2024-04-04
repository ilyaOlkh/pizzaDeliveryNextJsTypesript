'use client'

import Header from "../header/page"
import PopupReg from "../components/popupReg"
import StartJS from "../components/startJS"

import { useContext, useEffect, useState, useRef } from "react"
import { MyContext } from "../context/contextProvider"
import { getOrders } from "../service/getOrders"
import OrderItem from "../ui/orderItem"
import getOrdersProductsByIDs from "../service/getOrdersProductsByIDs"
import { Pagination } from "@mui/material";

const HTMLLoading = (
    <div className='error__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

export default function ClientPersonalPage({ orders, ordersDetails, searchParams, numOfPages }) {
    const [page, setPage] = useState(searchParams[process.env.NEXT_PUBLIC_ID_FOR_PAGE])
    const { userState, setUser } = useContext(MyContext)
    const [ordersState, setOrders] = useState(orders)
    const [ordersDetailsState, setOrdersDetails] = useState(ordersDetails)
    const [loadingState, setLoading] = useState(false)
    const userStateRef = useRef(userState);
    const pageRef = useRef(page);
    console.log(orders, ordersDetails)


    const updateOrders = async () => {
        console.log('rerender')
        setLoading(true)
        let orders = await getOrders(+page, +process.env.NEXT_PUBLIC_NUM_IN_PAGE) || []
        let ordersProducts = await getOrdersProductsByIDs(orders.map(item => item.order_id), +page, +process.env.NEXT_PUBLIC_NUM_IN_PAGE) || []
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
        if (pageRef.current != page) {
            console.log('rerender')

            pageRef.current = page
            updateOrders()
            console.log(page)
            setPageParam()

        }
    }, [page])

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
        <Header />
        <main className="page">
            <section className="personal">
                <div className="personal__container">
                    <div className="personal__orders">
                        {userState ? (
                            loadingState ? <div className="error">{HTMLLoading}</div> :
                                (
                                    ordersState.length > 0 ?
                                        ordersState.map((item) => {
                                            console.log('item', item, item.order_id)
                                            return (
                                                <OrderItem orderData={item} orderProductsData={ordersDetailsState[item.order_id]} />
                                            )
                                        }) :
                                        <div className="error">
                                            <span className="error__code">вы еще ничего не заказали</span>
                                        </div>
                                )
                        ) :
                            <div className="error">
                                <span className="error__code">вы не вошли в аккаунт</span>
                            </div>
                        }
                    </div>
                    {
                        (numOfPages && numOfPages > 1) ? <div className="personal__pagination"><Pagination defaultPage={+page} hidePrevButton hideNextButton count={+numOfPages} onChange={handleChange} /></div> : <></>
                    }

                </div>
            </section>
        </main>
    </>
}