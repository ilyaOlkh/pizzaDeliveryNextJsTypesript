'use client'
import { settings } from '@/app/settings';
import React, { useEffect, useState } from 'react';
import { getProduct } from '../service/getProduct.js';
import getIngredients from '../service/getIngredients.js';

export const revalidate = 10

const HTMLLoading = (
    <img src="/Common/loading.svg" alt="loading" className='card__loading' />
)

const popupProductHash = '#card'

export default function popupProduct() {
    const [isLoading, setLoading] = useState(true)
    const [product, setProduct] = useState(undefined)
    const [ingredients, setIngredients] = useState([])
    let content;
    async function click1(e) {
        console.log(e)
        if (e.detail.popup.hash == popupProductHash) {

            let filters = window.location.search
            const params = new URLSearchParams(filters)
            console.log(product, params.get(settings.idForProduct))
            if (document.querySelector('#card').dataset.productId != params.get(settings.idForProduct)) {
                setLoading(true)
                const id = params.get(settings.idForProduct)
                let productRespons = await getProduct(id)
                console.log(productRespons)
                setProduct(productRespons[0])
                if (productRespons.length > 1) {
                    alert('ОШИБКА ПРИ ПОЛУЧЕНИИ ДАННЫХ О ПРОДУКТЕ!')
                }

                let Ingredients = await getIngredients(id)
                setIngredients(Ingredients)
                console.log(ingredients)
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        console.log('продукты отрендерены')
        document.addEventListener('beforePopupOpen', click1);

        return () => {
            document.removeEventListener('beforePopupOpen', click1);
        };
    }, []);
    if (isLoading) {
        content = HTMLLoading
    } else {
        content =
            (<>
                <div class="card__img">
                    <div class="card__img-inner"><img src={product.image_url.slice(3)} alt="pizza" /></div>
                </div>
                <form action="" method="post" class="card__info">
                    <div class="card__info-wrapper">
                        <div class="card__phantom-img">
                            <div> </div>
                        </div>
                        <div class="card__info-blur">
                            <div class="card__info-block">
                                <h2 class="card__title-product">
                                    {/* <img src="/Common/Fire.svg" alt="Fire" /> */}
                                    <span>{product.p_name}</span>

                                </h2>
                                <div class="card__ingridients">
                                    {ingredients.map(({ i_type, i_name }) => {
                                        return (
                                            <div class="card__ingridient ingridient">
                                                <div class="ingridient__img">
                                                    <div class="ingridient__img-inner"><img src={`/ingredients/${i_type}.png`} alt={i_type} /></div>
                                                </div>
                                                <div class="ingridient__text">{i_name}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div class="card__info-block">
                                <div class="card__block-buttons">
                                    <label class="card__option">
                                        <input type="radio" defaultChecked name="test1" style={{ display: 'none' }} /><span id="word_opts">Традиционное</span>
                                    </label>
                                    <label class="card__option">
                                        <input type="radio" name="test1" style={{ display: 'none' }} /><span id="word_opts">Тонкое</span>
                                    </label>
                                </div>
                                <div class="card__block-buttons">
                                    <label class="card__option">
                                        <input type="radio" defaultChecked name="test12" style={{ display: 'none' }} /><span id="word_opts">20 см</span>
                                    </label>
                                    <label class="card__option">
                                        <input type="radio" name="test12" style={{ display: 'none' }} /><span id="word_opts">28 см</span>
                                    </label>
                                    <label class="card__option">
                                        <input type="radio" name="test12" style={{ display: 'none' }} /><span id="word_opts">33 см</span>
                                    </label>
                                </div>
                            </div>
                            <div class="card__info-block">
                                <h3 class="card__title-second">Добавьте в пиццу</h3>
                                <div class="card__ingridients">
                                    <label class="card__option card__ingridient ingridient ingridient_not-worked">
                                        <input type="checkbox" name="test1" style={{ display: 'none' }} />
                                        <div class="ingridient__img">
                                            <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
                                        </div>
                                        <div class="ingridient__text">Моцарелла</div>
                                        <div class="ingridient__price">59<span> ₴</span></div>
                                    </label>
                                    <label class="card__option card__ingridient ingridient">
                                        <input type="checkbox" name="test1" style={{ display: 'none' }} />
                                        <div class="ingridient__img">
                                            <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
                                        </div>
                                        <div class="ingridient__text">Моцарелла</div>
                                        <div class="ingridient__price">59<span> ₴</span></div>
                                    </label>
                                    <label class="card__option card__ingridient ingridient">
                                        <input type="checkbox" name="test1" style={{ display: 'none' }} />
                                        <div class="ingridient__img">
                                            <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
                                        </div>
                                        <div class="ingridient__text">Моцарелла</div>
                                        <div class="ingridient__price">59<span> ₴</span></div>
                                    </label>
                                    <label class="card__option card__ingridient ingridient">
                                        <input type="checkbox" name="test1" style={{ display: 'none' }} />
                                        <div class="ingridient__img">
                                            <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
                                        </div>
                                        <div class="ingridient__text">Моцарелла</div>
                                        <div class="ingridient__price">59<span> ₴</span></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card__info-send send">
                        <div class="send__info">
                            <div class="send__price">Итого: <span id="send__price">379</span><span> ₴</span></div>
                            <div class="send__weight">400 <span> г</span></div>
                        </div>
                        <button type="submit" class="send__submit">Добавить</button>
                    </div>
                </form>
            </>)
    }
    return (
        <div data-product-id={product ? product.product_id : 'loading'} id="card" aria-hidden="true" class="popup card">
            <div class="popup__wrapper card__wrapper">
                <div class="popup__content card__content">
                    <button data-close="data-close" type="button" class="popup__close card__close"><img src="/Common/CrossWhite.svg" alt="Cross" /></button>
                    <div class="card__body">
                        {content}
                    </div>
                </div>
            </div>
        </div>
        // <div id="card" aria-hidden="true" class="popup card">
        //     <div class="popup__wrapper card__wrapper">
        //         <div class="popup__content card__content">
        //             <button data-close="data-close" type="button" class="popup__close card__close"><img src="/Common/CrossWhite.svg" alt="Cross" /></button>
        //             <div class="card__body">
        //                 <div class="card__img">
        //                     <div class="card__img-inner"><img src="/pizzas/1. Пицца с креветками и ананасами.jpeg" alt="pizza" /></div>
        //                 </div>
        // <form action="" method="get" class="card__info">
        //     <div class="card__info-wrapper">
        //         <div class="card__phantom-img">
        //             <div> </div>
        //         </div>
        //         <div class="card__info-blur">
        //             <div class="card__info-block">
        //                 <h2 class="card__title-product">

        //                     <img src="/Common/Fire.svg" alt="Fire" /><span>Пепперони по-деревенски</span>
        //                 </h2>
        //                 <div class="card__ingridients">
        //                     <div class="card__ingridient ingridient">
        //                         <div class="ingridient__img">
        //                             <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
        //                         </div>
        //                         <div class="ingridient__text">Моцарелла</div>
        //                     </div>
        //                     <div class="card__ingridient ingridient">
        //                         <div class="ingridient__img">
        //                             <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
        //                         </div>
        //                         <div class="ingridient__text">Моцарелла</div>
        //                     </div>
        //                     <div class="card__ingridient ingridient">
        //                         <div class="ingridient__img">
        //                             <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
        //                         </div>
        //                         <div class="ingridient__text">Моцарелла</div>
        //                     </div>
        //                     <div class="card__ingridient ingridient">
        //                         <div class="ingridient__img">
        //                             <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
        //                         </div>
        //                         <div class="ingridient__text">Моцарелла</div>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div class="card__info-block">
        //                 <div class="card__block-buttons">
        //                     <label class="card__option">
        //                         <input type="radio" defaultChecked name="test1" style={{ display: 'none' }} /><span id="word_opts">Традиционное</span>
        //                     </label>
        //                     <label class="card__option">
        //                         <input type="radio" name="test1" style={{ display: 'none' }} /><span id="word_opts">Тонкое</span>
        //                     </label>
        //                 </div>
        //                 <div class="card__block-buttons">
        //                     <label class="card__option">
        //                         <input type="radio" defaultChecked name="test12" style={{ display: 'none' }} /><span id="word_opts">20 см</span>
        //                     </label>
        //                     <label class="card__option">
        //                         <input type="radio" name="test12" style={{ display: 'none' }} /><span id="word_opts">28 см</span>
        //                     </label>
        //                     <label class="card__option">
        //                         <input type="radio" name="test12" style={{ display: 'none' }} /><span id="word_opts">33 см</span>
        //                     </label>
        //                 </div>
        //             </div>
        //             <div class="card__info-block">
        //                 <h3 class="card__title-second">Добавьте в пиццу</h3>
        //                 <div class="card__ingridients">
        //                     <label class="card__option card__ingridient ingridient ingridient_not-worked">
        //                         <input type="checkbox" name="test1" style={{ display: 'none' }} />
        //                         <div class="ingridient__img">
        //                             <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
        //                         </div>
        //                         <div class="ingridient__text">Моцарелла</div>
        //                         <div class="ingridient__price">59<span> ₴</span></div>
        //                     </label>
        //                     <label class="card__option card__ingridient ingridient">
        //                         <input type="checkbox" name="test1" style={{ display: 'none' }} />
        //                         <div class="ingridient__img">
        //                             <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
        //                         </div>
        //                         <div class="ingridient__text">Моцарелла</div>
        //                         <div class="ingridient__price">59<span> ₴</span></div>
        //                     </label>
        //                     <label class="card__option card__ingridient ingridient">
        //                         <input type="checkbox" name="test1" style={{ display: 'none' }} />
        //                         <div class="ingridient__img">
        //                             <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
        //                         </div>
        //                         <div class="ingridient__text">Моцарелла</div>
        //                         <div class="ingridient__price">59<span> ₴</span></div>
        //                     </label>
        //                     <label class="card__option card__ingridient ingridient">
        //                         <input type="checkbox" name="test1" style={{ display: 'none' }} />
        //                         <div class="ingridient__img">
        //                             <div class="ingridient__img-inner"><img src="@img/Common/cheese.svg" alt="cheese" /></div>
        //                         </div>
        //                         <div class="ingridient__text">Моцарелла</div>
        //                         <div class="ingridient__price">59<span> ₴</span></div>
        //                     </label>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div class="card__info-send send">
        //         <div class="send__info">
        //             <div class="send__price">Итого: <span id="send__price">379</span><span> ₴</span></div>
        //             <div class="send__weight">400 <span> г</span></div>
        //         </div>
        //         <button type="submit" class="send__submit">Добавить</button>
        //     </div>
        // </form>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}