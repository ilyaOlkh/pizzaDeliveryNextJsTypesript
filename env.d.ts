declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_GLOBAL_URL: string;
        NEXT_PUBLIC_PIZZA_URL: string;
        NEXT_PUBLIC_SUSHI_URL: string;
        NEXT_PUBLIC_DRINKS_URL: string;
        NEXT_PUBLIC_SNAKS_URL: string;
        NEXT_PUBLIC_SAUCES_URL: string;
        NEXT_PUBLIC_DESSERT_URL: string;

        NEXT_PUBLIC_ID_FOR_PRODUCT: string;
        NEXT_PUBLIC_ID_FOR_PAGE: string;
        NEXT_PUBLIC_NUM_IN_PAGE: string;
        NEXT_PUBLIC_ID_FOR_ORDER: string;
        NEXT_PUBLIC_POPUP_ORDER_HASH: string;
        NEXT_PUBLIC_SORT_PARAM: string;
        NEXT_PUBLIC_DIR_PARAM: string;
        NEXT_PUBLIC_SORTS_ORDER: string;
        NEXT_PUBLIC_ALL_SORTS_RULES: string;
        NEXT_PUBLIC_TYPES_WITH_COMPOSITION: string;

        NEXT_PUBLIC_FILTERS_SPECIAL_PARAMS: string;

        POSTGRES_URL: string;
        POSTGRES_PRISMA_URL: string;
        POSTGRES_URL_NO_SSL: string;
        POSTGRES_URL_NON_POOLING: string;
        POSTGRES_USER: string;
        POSTGRES_HOST: string;
        POSTGRES_PASSWORD: string;
        POSTGRES_DATABASE: string;

        JWT_ACCESS_SECRET: string;
        JWT_REFRESH_SECRET: string;
    }
}