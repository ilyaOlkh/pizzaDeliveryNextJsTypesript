'use client';
import { createContext, SetStateAction, useState, Dispatch } from "react";
import { setCartCookie } from "../CartServerServices/SetCartCookie";
import { setParams } from "../service/setSearchParams";
import { IUser } from "../types/user";
import { TypeCart } from "../types/cart";
import { ISort } from "../types/sort";
import { TypeProductsInfo } from "../types/products";
import { TypeOrderDetails } from "../types/OrderDetails";
import { TypeOrders } from "../types/order";

type TypeParam = Record<string, string>

interface UserContextType {
    userState: IUser | null
    setUser: Dispatch<SetStateAction<IUser | null>>
}

interface SortContextType {
    sortState: ISort
    setSort: (sortState: ISort) => void
}

interface CartContextType {
    cartState: TypeCart
    setCart: (cartState: TypeCart) => void
}

interface ProductsInfoContextType {
    productsInfoState: TypeProductsInfo
    setProductsInfo: Dispatch<SetStateAction<TypeProductsInfo>>
}

interface OrdersContextType {
    ordersState: TypeOrders | 'error' | 'no access'
    setOrders: Dispatch<SetStateAction<TypeOrders | 'error' | 'no access'>>
}

interface OrdersDetailsContextType {
    ordersDetailsState: TypeOrderDetails
    setOrdersDetails: Dispatch<SetStateAction<TypeOrderDetails>>
}

interface IsAdminContextType {
    isAdminState: boolean
    setIsAdmin: Dispatch<SetStateAction<boolean>>
}

export const MyContext = createContext<UserContextType | null>(null);
export const CartContext = createContext<CartContextType | null>(null);
export const ProductsInfoContext = createContext<ProductsInfoContextType | null>(null);

export const OrdersContext = createContext<OrdersContextType | null>(null);
export const OrdersDetailsContext = createContext<OrdersDetailsContextType | null>(null);
export const isAdminContext = createContext<IsAdminContextType | null>(null);
export const sortContext = createContext<SortContextType | null>(null);

export function SortProvider({ children, sort }: { children: JSX.Element, sort: ISort }) {
    const [sortState, setSortState] = useState<ISort>(sort);

    function setSort(sortState: ISort) {
        const typeParam: TypeParam = {
            sortRule: sortState.sortRule,
            direction: sortState.direction,
        }
        setParams(typeParam)
        setSortState(sortState)
    }

    return (
        <sortContext.Provider value={{ sortState, setSort }}>
            {children}
        </sortContext.Provider>
    );
}



export function Providers({ children, user, cart, ProductsInfo }: { children: JSX.Element, user: IUser | null, cart: TypeCart, ProductsInfo: TypeProductsInfo }) {
    const [userState, setUser] = useState<IUser | null>(user);
    const [cartState, setCartWithoutCookie] = useState<TypeCart>(cart);
    const [productsInfoState, setProductsInfo] = useState<TypeProductsInfo>(ProductsInfo);

    function setCart(cartState: TypeCart) {
        setCartWithoutCookie(cartState)
        setCartCookie(JSON.stringify(cartState))
        console.log('cartState змінено')
    }

    return (
        <ProductsInfoContext.Provider value={{ productsInfoState, setProductsInfo }
        }>
            <CartContext.Provider value={{ cartState, setCart }}>
                <MyContext.Provider value={{ userState, setUser }}>
                    {children}
                </MyContext.Provider>
            </CartContext.Provider>
        </ProductsInfoContext.Provider>
    );
}

export function UserProviders({ children, orders, ordersDetails, isAdmin = false }: { children: JSX.Element, orders: TypeOrders | 'error' | 'no access', ordersDetails: TypeOrderDetails, isAdmin: boolean }) {
    const [ordersState, setOrders] = useState<TypeOrders | 'error' | 'no access'>(orders);
    const [ordersDetailsState, setOrdersDetails] = useState<TypeOrderDetails>(ordersDetails);
    const [isAdminState, setIsAdmin] = useState<boolean>(isAdmin);


    return (
        <OrdersContext.Provider value={{ ordersState, setOrders }
        }>
            <OrdersDetailsContext.Provider value={{ ordersDetailsState, setOrdersDetails }}>
                <isAdminContext.Provider value={{ isAdminState, setIsAdmin }}>
                    {children}
                </isAdminContext.Provider>
            </OrdersDetailsContext.Provider>
        </OrdersContext.Provider >
    );
}