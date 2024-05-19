'use client'

import ProductCard from '../../ui/productCard'
import Header from "../../header/page.js"
import Filters from '@/app/components/popupFilters'
import PopupProduct from '@/app/components/popupProduct'
import PopupSort from '@/app/components/PopupSort'
import { useRef, useContext, useEffect, useState } from 'react'
import { sortContext } from '@/app/context/contextProvider'
import getProducts from '@/app/service/getProducts'
// import PopupCheque from '@/app/components/PopupCheque'





const HTMLLoading = (
    <div className='error__loading'>
        <img src="/Common/loading.svg" alt="loading" />
    </div>
)

export default function ClientPage({ ProductTypes, products, type, filtersContent, sortParams, filters, params }) {
    const { sortState, setSort } = useContext(sortContext);
    const [productsState, setProducts] = useState(products)
    const [loadingState, setLoading] = useState(false)
    const [sizeState, setSize] = useState(!!params.searchParams['size_sm'])
    console.log(sizeState)
    const sortRef = useRef(sortState);
    const withComposition = process.env.NEXT_PUBLIC_TYPES_WITH_COMPOSITION.split(', ').includes(type)

    let body
    let typeUpper = type.charAt(0).toUpperCase() + type.slice(1);

    const updateProducts = async () => {
        console.log('rerender')
        setLoading(true)
        let products = await getProducts({
            type: type,
            filters: (Object.keys(filters).length !== 0 ?
                (type != 'піца' ? { ...filters, size_sm: 'null' } : filters)
                : undefined),
            sort: sortState
        }) || []
        console.log(products)
        setProducts(products)
        setLoading(false)
    }
    useEffect(() => {
        if (sortRef.current != sortState) {
            console.log('rerender')
            sortRef.current = sortState
            updateProducts()
        }
    }, [sortState])

    if (ProductTypes.includes(type)) {
        if (productsState.length > 0) {
            body = productsState.map(pizza => {
                return (<ProductCard withComposition={withComposition} productData={pizza} type={type} />)
            })
        } else {
            body = (
                <div className="error error_product">
                    <span className="error__code">таких продуктів немає</span>
                </div>)
        }

    } else {
        body = (
            <div className="error error_product">
                <span className="error__code">таких типів продуктів немає</span>
            </div>)
    }
    // function sizeSelected() {
    //     try {
    //         let form = new FormData(document.querySelector('#filters form'))
    //         return !!form.get('size_sm')
    //     } catch (e) {
    //         return false
    //     }
    // }
    return <>
        {/* <PopupCheque /> */}
        {ProductTypes.includes(type) ? <Filters type={type} setSize={setSize} filtersContent={filtersContent} /> : <></>}
        {ProductTypes.includes(type) && (productsState.length > 0) ? <PopupSort sortParams={sortParams} /> : <></>}
        <PopupProduct withComposition={withComposition} />
        <Header />

        <main className="page">
            <section className="priceList">
                <div className="priceList__container">
                    <div className="priceList__header">
                        <h1 className="priceList__title">{typeUpper}</h1>
                        <div className="priceList__button-container">
                            {!ProductTypes.includes(type) ? <></> :
                                <>
                                    {
                                        <button type="button" data-popup="#filters" className="priceList__filter button">
                                            <img src="/Common/Filter.svg" alt="Filter" width={20} height={20} /><span>Фільтри</span>
                                        </button>
                                    }
                                    {
                                        (productsState.length > 0) ?
                                            (<button type="button" data-popup="#sort" className="priceList__filter button">
                                                <img src="/Common/Sort.svg" alt="sort" width={20} height={20} /><span>Сортування</span>
                                            </button>) : <></>
                                    }
                                </>
                            }
                        </div>
                    </div>
                    {loadingState ?
                        <div className="error">{HTMLLoading}</div> : <div className="priceList__grid">{body}</div>
                    }
                </div>
            </section>
        </main >
    </>
}