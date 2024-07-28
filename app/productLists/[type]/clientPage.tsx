'use client'

import ProductCard from '../../ui/productCard'
import Header from "../../header/page"
import Filters from '@/app/components/popupFilters'
import PopupProduct from '@/app/components/popupProduct'
import PopupSort from '@/app/components/PopupSort'
import { useRef, useEffect, useState } from 'react'
import { sortContext } from '@/app/context/contextProvider'
import getProducts from '@/app/service/getProducts'
import { Database } from '@/app/types/databaseSchema'
import { IProduct } from '@/app/types/products'
import { IFilter } from '@/app/types/filters'
import { ISortParam } from '@/app/types/sort'
import { useSafeContext } from '@/app/service/useSafeContext'



interface IProps {
    filters: any,
    ProductTypes: Database['product']['p_type'][],
    products: IProduct[],
    type: string,
    filtersContent: IFilter[],
    sortParams: ISortParam[],
}

const HTMLLoading = (
    <div className='error__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

export default function ClientPage({ filters, ProductTypes, products, type, filtersContent, sortParams }: IProps) {
    let typeUpper = type.charAt(0).toUpperCase() + type.slice(1);
    const [loadingState, setLoading] = useState(false)

    if (isPType(type)) {
        const { sortState, setSort } = useSafeContext(sortContext);
        const [productsState, setProducts] = useState(products)
        const sortRef = useRef(sortState);
        const withComposition = process.env.NEXT_PUBLIC_TYPES_WITH_COMPOSITION.split(', ').includes(type)

        let body

        const updateProducts = async () => {
            setLoading(true)
            let products = await getProducts({
                type: type,
                filters: (Object.keys(filters).length !== 0 ?
                    (type != 'піца' ? { ...filters, size_sm: 'null' } : filters)
                    : undefined),
                sort: sortState
            }) || []
            setProducts(products)
            setLoading(false)
        }
        useEffect(() => {
            if (sortRef.current != sortState) {
                sortRef.current = sortState
                updateProducts()
            }
        }, [sortState])

        if (productsState.length > 0) {
            body = productsState.map(pizza => {
                return (<ProductCard key={pizza.product_id} productData={pizza} type={type} />)
            })
        } else {
            body = (
                <div className="error error_product">
                    <span className="error__code">таких продуктів немає</span>
                </div>)
        }

        return <>
            <Filters type={type} filtersContent={filtersContent} />
            <PopupSort sortParams={sortParams} />
            <PopupProduct />
            <Header />
            <main className="page">
                <section className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">{typeUpper}</h1>
                            <div className="priceList__button-container">
                                <button type="button" data-popup="#filters" className="priceList__filter button">
                                    <img src="/Common/Filter.svg" alt="Filter" width={20} height={20} /><span>Фільтри</span>
                                </button>
                                <button type="button" data-popup="#sort" className="priceList__filter button">
                                    <img src="/Common/Sort.svg" alt="sort" width={20} height={20} /><span>Сортування</span>
                                </button>
                            </div>
                        </div>
                        {loadingState ?
                            <div className="error">{HTMLLoading}</div> : <div className="priceList__grid">{body}</div>
                        }
                    </div>
                </section>
            </main >
        </>
    } else {
        return <>
            <Header />
            <main className="page">
                <section className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">{typeUpper}</h1>
                        </div>
                        {loadingState ?
                            <div className="error">{HTMLLoading}</div> :
                            <div className="priceList__grid">
                                <div className="error error_product">
                                    <span className="error__code">таких типів продуктів немає</span>
                                </div>
                            </div>
                        }
                    </div>
                </section>
            </main >
        </>
    }
}

function isPType(type: string): type is Database['product']['p_type'] {
    if (type === "піца" || type === "суші" || type === "напої" || type === "закуски" || type === "десерти" || type === "соуси") {
        return true
    }
    return false
}