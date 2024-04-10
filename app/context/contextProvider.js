'use client';
import { useRouter } from "next/router";
import { createContext, useState } from "react";
import { setCartCookie } from "../CartServerServices/SetCartCookie";
import { setParams } from "../service/setSearchParams";

export const MyContext = createContext();
export const CartContext = createContext();
export const ProductsInfoContext = createContext();

export const OrdersContext = createContext();
export const OrdersDetailsContext = createContext();
export const isAdminContext = createContext();
export const sortContext = createContext();

export function Providers({ children, user, cart, ProductsInfo }) {
    const [userState, setUser] = useState(user);
    const [cartState, setCartWithoutCookie] = useState(cart);
    const [productsInfoState, setProductsInfo] = useState(ProductsInfo);

    function setCart(cartState) {
        setCartWithoutCookie(cartState)
        setCartCookie(JSON.stringify(cartState))
        console.log('cartState изменен')
    }

    return (
        <ProductsInfoContext.Provider value={{ productsInfoState, setProductsInfo }}>
            <CartContext.Provider value={{ cartState, setCart }}>
                <MyContext.Provider value={{ userState, setUser }}>
                    {children}
                </MyContext.Provider>
            </CartContext.Provider>
        </ProductsInfoContext.Provider>
    );
}

export function UserProviders({ children, orders, ordersDetails, isAdmin = false, sort }) {
    const [ordersState, setOrders] = useState(orders);
    const [ordersDetailsState, setOrdersDetails] = useState(ordersDetails);
    const [isAdminState, setIsAdmin] = useState(isAdmin);
    const [sortState, setSortState] = useState(sort);

    function setSort(sortState) {
        setParams(sortState)
        setSortState(sortState)
    }
    return (
        <OrdersContext.Provider value={{ ordersState, setOrders }}>
            <OrdersDetailsContext.Provider value={{ ordersDetailsState, setOrdersDetails }}>
                <isAdminContext.Provider value={{ isAdminState, setIsAdmin }}>
                    <sortContext.Provider value={{ sortState, setSort }}>
                        {children}
                    </sortContext.Provider>
                </isAdminContext.Provider>
            </OrdersDetailsContext.Provider>
        </OrdersContext.Provider >
    );
}