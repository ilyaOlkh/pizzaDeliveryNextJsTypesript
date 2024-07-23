import React, { useContext } from "react";

export function useSafeContext<T>(context: React.Context<T | null>, contextName?: string): T {
    const ctx = useContext(context);
    if (ctx === null) {
        throw new Error(`Context "${contextName}" must be used within a Provider`);
    }
    return ctx;
}