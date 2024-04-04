'use client';
import { createContext, useState } from "react";
import { setCartCookie } from "../CartServerServices/SetCartCookie";

export const MyContext = createContext();
export const CartContext = createContext();
export const ProductsInfoContext = createContext();

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