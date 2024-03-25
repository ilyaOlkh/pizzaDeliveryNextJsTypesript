'use client';
import { createContext, useState } from "react";
export const MyContext = createContext();

export function Providers({ children, user }) {
    const [userState, setUser] = useState(user);
    return (
        <MyContext.Provider value={{ userState, setUser }}>
            {children}
        </MyContext.Provider>
    );
}