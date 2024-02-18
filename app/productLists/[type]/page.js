import prompt from '../../service/prompt'
import getProductTypes from '../../service/getProductTypes'
import { settings } from '@/app/settings';
import Image from "next/image";
import ProductCard from '../../ui/productCard'
import Header from "../../header/page.js"
import Filters from '../../components/popupFilters'
import dynamic from 'next/dynamic';
import PopupProduct from '../../components/popupProduct'
import '../../js/app.js'


const urlPizza = 'getPizza.php'

export default async function productList(params) {

    let decodedContent = {};
    console.log(params.searchParams)
    for (let key in params.searchParams) {
        if (key == settings.idForProduct) {
            continue
        }
        let decodedKey = decodeURIComponent(key);
        let decodedValue = decodeURIComponent(params.searchParams[key]);
        decodedContent[decodedKey] = decodedValue;
    }
    const filters = decodedContent



    let type = decodeURIComponent(params.params.type)
    let typeUpper = type.charAt(0).toUpperCase() + type.slice(1);
    let products
    if (Object.keys(filters).length !== 0) {
        products = await prompt(urlPizza, { type: type, filters: filters })
    } else {
        products = await prompt(urlPizza, { type: type })

    }
    let ProductTypes = await getProductTypes()
    let body;

    if (ProductTypes.includes(type)) {
        if (products != undefined) {
            body = products.map(pizza => {
                return (<ProductCard productData={pizza} />)
            })
            if (body.length < 4) {
                // for (let j = body.length; j < 4; j++) {
                //     body.push((
                //         <div className="priceList__item priceItem">
                //             <div className="priceItem__inner">
                //                 <div className="priceItem__img">
                //                 </div>
                //                 <div className="priceItem__info">
                //                 </div>
                //             </div>
                //         </div>
                //     ))
                // }
            }
        } else {
            body = (
                <div class="error error_product">
                    <span class="error__code">таких продуктов нет</span>
                </div>)
        }

    } else {
        body = (
            <div class="error error_product">
                <span class="error__code">таких типов продуктов нет</span>
            </div>)
    }
    return (
        <>
            {ProductTypes.includes(type) ? <Filters type={type} /> : <></>}
            <PopupProduct />
            <Header />
            <main className="page">
                <section className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">{typeUpper}</h1>
                            {!ProductTypes.includes(type) ? <></> :
                                <button type="button" data-popup="#filters" className="priceList__filter button"><Image src="/Common/Filter.svg" alt="Filter" width={20} height={20} /><span>Фильтры</span></button>
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