'use client'
import React, { useEffect, useState, useContext, FormEventHandler, FormEvent, MouseEventHandler } from 'react';
import { getProduct } from '../service/getProduct';
import getIngredients from '../service/getIngredients';
import getSizes from '../service/getSizes';
import { CartContext } from '../context/contextProvider'
import { ProductsInfoContext } from '../context/contextProvider';
import { useSearchParams } from 'next/navigation';
import { useSafeContext } from '../service/useSafeContext';
import { ICartItem } from '../types/cart';
import { CustomPopupEvent } from '../types/popupEvents';
import { IProduct } from '../types/products';
import { flsModules } from '../js/files/modules';

const HTMLLoading = (
    <img src="/Common/loading.svg" alt="loading" className='card__loading' />
)

const popupProductHash = '#card'

declare global {
    interface DocumentEventMap {
        beforePopupOpen: CustomPopupEvent;
        afterPopupClose: CustomPopupEvent;
    }
}

interface ICurentSize {
    id: number;
    size_cm: "20" | "28" | "33" | null;
    weight_g: number;
    price: number;
}

interface IIngridient {
    i_type: "соуси" | "сири" | "м'ясо" | "ковбаси" | "морепродукти" | "овочі" | "гриби" | "трави" | "фрукти" | "риба" | "водорості" | "інше";
    i_name: string;
}

function addMessage() {
    let thisMessages = document.querySelector('.card .popup__messages-wrapper')
    if (thisMessages) {
        let newMessage = document.createElement('div');
        newMessage.classList.add('popup__message', 'popup__message_hidden')
        newMessage.innerHTML = `<div class="popup__message-inner"><img src="/Common/checkmark.svg" alt="checkMark" />Товар додан до кошика!</div>`
        thisMessages.appendChild(newMessage);
        setTimeout(() => { newMessage.classList.remove('popup__message_hidden') }, 10)
        setTimeout(() => {
            newMessage.classList.add('popup__message_hidden')
            setTimeout(() => { newMessage.remove() }, 3000);
        }, 3000)
    } else {
        alert('не знайдено оболонку для сповіщення')
    }
}

export default function popupProduct(): React.JSX.Element {
    const { cartState, setCart } = useSafeContext(CartContext)
    const { productsInfoState, setProductsInfo } = useSafeContext(ProductsInfoContext)
    const [isLoading, setLoading] = useState(true)
    const [product, setProduct] = useState<IProduct | null>(null)
    const [ingredients, setIngredients] = useState<IIngridient[]>([])
    const [avalibleSizes, setAvalibleSizes] = useState<ICurentSize[]>([])
    const [curentSize, setCurentSize] = useState<ICurentSize | null>(null)

    const searchParamEncode = useSearchParams().get('size_sm')
    const searchParam = searchParamEncode ? decodeURIComponent(searchParamEncode) : undefined

    let content: JSX.Element;
    let uniqueDivKey: number = 0
    let uniqueLabelKey: number = 0


    function findById(id: number, dough: string): number | false {
        let responce: number | false = false
        cartState.forEach((value, index) => {
            if (value.id == id && value.dough == dough) {
                responce = index
            }
        })
        return responce
    }

    function submit(event: FormEvent<HTMLFormElement>): void {
        if (product) {
            if (curentSize) {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const dough = formData.get('dough')
                if (dough) {
                    if (!(dough instanceof File)) {
                        let isInCart = findById(curentSize.id, dough)
                        if (isInCart !== false) {
                            let newCartState = [...cartState]
                            newCartState[isInCart].quantity++
                            setCart(newCartState)
                        } else {
                            productsInfoState[curentSize.id] = {
                                id: curentSize.id,
                                image_url: product.image_url,
                                p_name: product.p_name,
                                price: curentSize.price,
                                size_cm: curentSize.size_cm,
                                weight_g: curentSize.weight_g
                            }
                            setCart([...cartState, { id: curentSize.id, quantity: 1, dough: dough, selled_price: curentSize.price }])
                        }
                        addMessage()
                    } else {
                        alert('замість тіста прийшов файл 😕')
                    }
                } else {
                    alert('у товару не обране тісто')
                }
            } else {
                alert('у товару не обран розмір')
            }
        } else {
            alert('не обран товар')
        }
    }



    async function click1(e: CustomPopupEvent): Promise<void> {
        if (e.detail.popup.hash == popupProductHash) {

            let filters = window.location.search
            const params = new URLSearchParams(filters)
            const popupProductElement: HTMLElement | null = document.querySelector(popupProductHash)
            const productId = params.get(process.env.NEXT_PUBLIC_ID_FOR_PRODUCT)
            if (productId) {
                if (popupProductElement) {
                    if (popupProductElement.dataset.productId != productId) {
                        setLoading(true)
                        let productRespons = await getProduct(parseInt(productId))
                        if (productRespons) {
                            setProduct(productRespons)
                            let Ingredients = await getIngredients(parseInt(productId))
                            setIngredients(Ingredients)
                            let sizesRespons = await getSizes(parseInt(productId))
                            setAvalibleSizes(sizesRespons)
                            if (searchParam && productRespons.p_type == "піца") {
                                const newCurentSize = sizesRespons.find((elem) => {
                                    return elem.size_cm == searchParam.replace('см', '')
                                })
                                if (newCurentSize) {
                                    setCurentSize(newCurentSize)
                                } else {
                                    alert('в пошуку неправильний параметр розміру')
                                    setCurentSize(sizesRespons[0])
                                }
                            } else {
                                setCurentSize(sizesRespons[0])
                            }
                        } else (
                            alert('ПОМИЛКА ПРИ ОТРИМАННІ ДАНИХ ПРО ПРОДУКТ!')
                        )
                        setLoading(false)
                    }
                } else {
                    alert('немає попапа #card')
                }
            } else {
                alert('немає id продукту в параметрах пошуку')
            }
        }
    }

    function changeSize(e: React.MouseEvent<HTMLInputElement, MouseEvent>): void {
        let newCurentSize = avalibleSizes.find((elem) => { return elem.size_cm == e.currentTarget.value })
        if (newCurentSize) {
            setCurentSize(newCurentSize)
        } else (
            console.log('не нашло выбранного размера')
        )
    }
    useEffect(() => {
        console.log('продукти відрендерені')
        document.addEventListener('beforePopupOpen', click1);

        return () => {
            document.removeEventListener('beforePopupOpen', click1);
        };
    }, []);
    if (isLoading) {
        content = HTMLLoading
    } else if (!curentSize) {
        flsModules.popup.close(popupProductHash)
        content = <></>
    } else if (product) {
        content =
            (<>
                {(avalibleSizes.length > 1 || ingredients.length > 0) ?
                    <div className="card__img">
                        <div className="card__img-inner"><img src={product.image_url.slice(3)} alt="pizza" /></div>
                    </div> : <></>
                }
                <form onSubmit={submit} method="post" className="card__info">
                    {!(avalibleSizes.length > 1 || ingredients.length > 0) ?
                        <h2 className="card__title-product">
                            {/* <img src="/Common/Fire.svg" alt="Fire" /> */}
                            <span>{product.p_name}</span>
                        </h2> : <></>
                    }
                    {(avalibleSizes.length > 1 || ingredients.length > 0) ?
                        <div className="card__info-wrapper">
                            <div className="card__phantom-img">
                                <div> </div>
                            </div>
                            <div className="card__info-blur">
                                <div className="card__info-block">
                                    <h2 className="card__title-product">
                                        {/* <img src="/Common/Fire.svg" alt="Fire" /> */}
                                        <span>{product.p_name}</span>
                                    </h2>
                                    <div className="card__ingridients">
                                        {ingredients.map(({ i_type, i_name }) => {
                                            uniqueDivKey++
                                            return (
                                                <div key={uniqueDivKey} className="card__ingridient ingridient">
                                                    <div className="ingridient__img">
                                                        <div className="ingridient__img-inner"><img src={`/ingredients/${i_type}.png`} alt={i_type} /></div>
                                                    </div>
                                                    <div className="ingridient__text">{i_name}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="card__info-block">
                                    {
                                        product.p_type == "піца" ?
                                            <div className="card__block-buttons">
                                                <label className="card__option">
                                                    <input type="radio" defaultChecked value="традиційне тісто" name="dough" style={{ display: 'none' }} /><span id="word_opts">Традиційне</span>
                                                </label>
                                                <label className="card__option">
                                                    <input type="radio" value="тонке тісто" name="dough" style={{ display: 'none' }} /><span id="word_opts">Тонке</span>
                                                </label>
                                            </div>
                                            :
                                            <></>
                                    }
                                    {avalibleSizes.length > 1 ?
                                        <div className="card__block-buttons">
                                            {
                                                avalibleSizes.map(size => {
                                                    uniqueLabelKey++
                                                    if (size.size_cm) {
                                                        return (
                                                            <label key={uniqueLabelKey} className="card__option">
                                                                <input onClick={changeSize} type="radio" defaultChecked={size.size_cm == curentSize.size_cm ? true : false} name="size" value={size.size_cm} style={{ display: 'none' }} /><span id="word_opts">{`${size.size_cm} см`}</span>
                                                            </label>
                                                        )
                                                    } else {
                                                        console.log('один розмір було пробущено')
                                                        return <></>
                                                    }
                                                })
                                            }
                                        </div>
                                        :
                                        <></>
                                    }
                                </div>
                                {/* <div className="card__info-block">--------------------------------------------------блок на будующее-----------------------------
                                <h3 className="card__title-second">Добавьте в пиццу</h3>
                                <div className="card__ingridients">
                                    <label className="card__option card__ingridient ingridient ingridient_not-worked">
                                        <input type="checkbox" name="test1" style={{ display: 'none' }} />
                                        <div className="ingridient__img">
                                            <div className="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
                                        </div>
                                        <div className="ingridient__text">Моцарелла</div>
                                        <div className="ingridient__price">59<span> ₴</span></div>
                                    </label>
                                    <label className="card__option card__ingridient ingridient">
                                        <input type="checkbox" name="test1" style={{ display: 'none' }} />
                                        <div className="ingridient__img">
                                            <div className="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
                                        </div>
                                        <div className="ingridient__text">Моцарелла</div>
                                        <div className="ingridient__price">59<span> ₴</span></div>
                                    </label>
                                    <label className="card__option card__ingridient ingridient">
                                        <input type="checkbox" name="test1" style={{ display: 'none' }} />
                                        <div className="ingridient__img">
                                            <div className="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
                                        </div>
                                        <div className="ingridient__text">Моцарелла</div>
                                        <div className="ingridient__price">59<span> ₴</span></div>
                                    </label>
                                    <label className="card__option card__ingridient ingridient">
                                        <input type="checkbox" name="test1" style={{ display: 'none' }} />
                                        <div className="ingridient__img">
                                            <div className="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
                                        </div>
                                        <div className="ingridient__text">Моцарелла</div>
                                        <div className="ingridient__price">59<span> ₴</span></div>
                                    </label>
                                </div>
                            </div> */}
                            </div>
                        </div> :
                        <>
                            <div className="card__info-wrapper">
                                <div className="card__img">
                                    <div className="card__img-inner"><img src={product.image_url.slice(3)} alt="pizza" /></div>
                                </div>
                            </div>
                        </>
                    }
                    <div className="card__info-send send">
                        <div className="send__info">
                            <div className="send__price">Ціна: <span id="send__price">{curentSize.price}</span><span> ₴</span></div>
                            <div className="send__weight">{curentSize.weight_g} <span> г</span></div>
                        </div>
                        <button type="submit" className="send__submit">Додати</button>
                    </div>
                </form >
            </>)
    } else {
        flsModules.popup.close(popupProductHash)
        content = <></>
    }
    return (
        <div data-product-id={product ? product.product_id : 'loading'} id="card" aria-hidden="true" className={"popup card"}>
            <div className="popup__messages">
                <div className="popup__messages-wrapper">
                </div>
            </div>
            <div className={"popup__wrapper card__wrapper" + (!(avalibleSizes.length > 1 || ingredients.length > 0) ? " card__wrapper_simplified" : "")}>
                <div className="popup__content card__content">
                    <button data-close="data-close" type="button" className="popup__close card__close"><img src="/Common/CrossWhite.svg" alt="Cross" /></button>
                    <div className="card__body">
                        {content}
                    </div>
                </div>
            </div>
        </div >
    )
}