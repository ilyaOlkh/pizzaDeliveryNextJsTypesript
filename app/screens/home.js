import ProductCard from '../ui/productCard.js'
// import Image from "next/image";
import Header from "../header/page"
import PopupProduct from '../components/popupProduct'
import PopupReg from '../components/popupReg';
// import PopupCheque from '@/app/components/PopupCheque'

export default function Home(pizzas, shushi, drinks, snaks, dessert, sauces) {
    return (
        <>
            {/* <PopupCheque /> */}
            <PopupProduct withComposition={true} />
            <PopupReg />
            <Header />
            <main className="page">
                <section className="categories">
                    <div className="categories__container swiper-container swiper">
                        <nav className="categories__list swiper-wrapper">
                            {/* <a href="" className="categories__category swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img">
                                        <img src="/Categories/Fire.svg" alt="Fire" width={32} height={32} />
                                    </div><span>Акції   </span>
                                </div>
                            </a> */}
                            <a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_PIZZA_URL} className="categories__category swiper-slide">
                                <div className="categories__category-inner ">
                                    <div className="categories__img"><img src="/Categories/Pizza.svg" alt="Pizza" width={32} height={32} /></div><span>Піца</span>
                                </div>
                            </a>
                            <a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_SUSHI_URL} className="categories__category swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><img src="/Categories/Sushi.svg" alt="Sushi" width={32} height={32} /></div><span>Суші</span>
                                </div>
                            </a>
                            <a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_DRINKS_URL} className="categories__category swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><img src="/Categories/Drink.svg" alt="Drink" width={32} height={32} /></div><span>Напої</span>
                                </div>
                            </a>
                            <a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_SNAKS_URL} className="categories__category swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><img src="/Categories/Snacks.svg" alt="Snacks" width={32} height={32} /></div><span>Закуски</span>
                                </div>
                            </a>
                            {/* <a href="" className="categories__category categories__category_notWorking swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><img src="/Categories/Combo.svg" alt="Combo" width={32} height={32} /></div><span>Комбо</span>
                                </div>
                            </a> */}
                            <a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_DESSERT_URL} className="categories__category swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><img src="/Categories/Dessert.svg" alt="Dessert" width={32} height={32} /></div><span>Десерти</span>
                                </div>
                            </a>
                            <a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_SAUCES_URL} className="categories__category swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><img src="/Categories/Sauce.svg" alt="Sauce" width={32} height={32} /></div><span>Соуси</span>
                                </div>
                            </a>
                        </nav>
                    </div>
                </section>
                {/* <section id="promotions" className="promotions">
                    <div className="promotions__container swiper-container swiper">
                        <div className="swiper-wrapper">
                            <div className="promotions__promo promo promo_orange swiper-slide">
                                <div className="promo__img"><img src="/promotions/back1.png" alt="pizza" width={458} height={269} /></div>
                                <div className="promo__text">3 середні піци від 999 гривень</div>
                            </div>
                            <div className="promotions__promo promo promo_red swiper-slide">
                                <div className="promo__img"><img src="/promotions/back2.svg" alt="pizza" width={279} height={116} /></div>
                                <div className="promo__text">Кешбек 10% на самовивіз (доставка)</div>
                            </div>
                            <div className="promotions__promo promo promo_orange swiper-slide">
                                <div className="promo__img"><img src="/promotions/back1.png" alt="pizza" width={458} height={269} /></div>
                                <div className="promo__text">3 середні піци від 999 гривень</div>
                            </div>
                            <div className="promotions__promo promo promo_red swiper-slide">
                                <div className="promo__img"><img src="/promotions/back2.svg" alt="pizza" width={279} height={116} /></div>
                                <div className="promo__text">Кешбек 10% на самовивіз (доставка)</div>
                            </div>
                        </div>
                    </div>
                </section> */}
                {/* <section className="CheckAddress">
                    <div className="CheckAddress__container">
                        <div className="CheckAddress__inner">
                            <div className="CheckAddress__text">Перевірити адресу доставки</div>
                            <form action="" className="CheckAddress__form">
                                <div className="CheckAddress__input"><img src="/Common/Location.svg" alt="Location" width={20} height={20} />
                                    <input type="text" placeholder="Адрес" />
                                </div>
                                <button type="submit" value="Перевірити" className="CheckAddress__send"><span>Перевірити</span><img src="/Common/Send.svg" alt="send" width={20} height={20} /></button>
                            </form>
                        </div>
                    </div>
                </section> */}
                <section id="pizza" className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_PIZZA_URL}>
                                <h1 className="priceList__title">Піца</h1>
                            </a>
                        </div>
                        <div className="priceList__grid">
                            {pizzas.map(pizza => {
                                return (<ProductCard key={pizza.product_id} productData={pizza} type={'піца'} />)
                            })}
                        </div>
                    </div>
                </section>
                <section id="shushi" className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">Суші</h1>
                        </div>
                        <div className="priceList__grid">
                            {shushi.map(shushka => {
                                return (<ProductCard key={shushka.product_id} productData={shushka} type={'суші'} />)
                            })}
                        </div>
                    </div>
                </section>
                <section id="drinks" className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">Напої</h1>
                        </div>
                        <div className="priceList__grid">
                            {drinks.map(drink => {
                                return (<ProductCard key={drink.product_id} productData={drink} type={'напої'} />)
                            })}
                        </div>
                    </div>
                </section>
                <section id="snaks" className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">Закуски</h1>
                        </div>
                        <div className="priceList__grid">
                            {snaks.map(snak => {
                                return (<ProductCard key={snak.product_id} productData={snak} type={'закуски'} />)
                            })}
                        </div>
                    </div>
                </section>
                <section id="dessert" className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">Десерти</h1>
                        </div>
                        <div className="priceList__grid">
                            {dessert.map(dessertOne => {
                                return (<ProductCard key={dessertOne.product_id} productData={dessertOne} type={'десерти'} />)
                            })}
                        </div>
                    </div>
                </section>
                <section id="sauces" className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">Соуси</h1>
                        </div>
                        <div className="priceList__grid">
                            {sauces.map(sauce => {
                                return (<ProductCard key={sauce.product_id} productData={sauce} type={'соуси'} />)
                            })}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}