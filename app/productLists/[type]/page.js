import getProductTypes from '../../service/getProductTypes'
import getIngredientsTypes from '../../service/getIngredientsTypes'
import { settings } from '@/app/settings';
// import Image from "next/image";
import ProductCard from '../../ui/productCard'
import Header from "../../header/page.js"
import Filters from '@/app/components/popupFilters'
import PopupProduct from '@/app/components/popupProduct'
import getProducts from '../../service/getProducts.js'
import PopupReg from '@/app/components/popupReg'
import AuthStart from '@/app/components/authStart';
import { GetUserInfoForServer } from '@/app/AuthControllers/GetDataController';

const i_types = await getIngredientsTypes()

export default async function productList(params) {
    //------авторизация----------
    const user = await GetUserInfoForServer();
    /////////////////////////////
    let decodedContent = {};
    for (let key in params.searchParams) {
        let decodedKey = decodeURIComponent(key);
        if (!i_types.includes(decodedKey)) {
            continue
        }
        let decodedValue = decodeURIComponent(params.searchParams[key]);
        decodedContent[decodedKey] = decodedValue;
    }
    const filters = decodedContent



    let type = decodeURIComponent(params.params.type)
    let typeUpper = type.charAt(0).toUpperCase() + type.slice(1);
    let products
    if (Object.keys(filters).length !== 0) {
        products = await getProducts({ type: type, filters: filters })
    } else {
        products = await getProducts({ type: type })

    }
    let ProductTypes = await getProductTypes()
    let body;

    if (ProductTypes.includes(type)) {
        if (products != undefined) {
            body = products.map(pizza => {
                return (<ProductCard productData={pizza} />)
            })
        } else {
            body = (
                <div className="error error_product">
                    <span className="error__code">таких продуктов нет</span>
                </div>)
        }

    } else {
        body = (
            <div className="error error_product">
                <span className="error__code">таких типов продуктов нет</span>
            </div>)
    }
    return (
        <>
            {ProductTypes.includes(type) ? <Filters type={type} /> : <></>}
            <PopupProduct />
            <PopupReg />
            <Header />
            <main className="page">
                <section className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">{typeUpper}</h1>
                            {!ProductTypes.includes(type) ? <></> :
                                <button type="button" data-popup="#filters" className="priceList__filter button">
                                    <img src="/Common/Filter.svg" alt="Filter" width={20} height={20} /><span>Фильтры</span>
                                </button>
                            }
                        </div>
                        <div className="priceList__grid">
                            {body}
                        </div>
                    </div>
                </section>
            </main >
        </>
    )
}