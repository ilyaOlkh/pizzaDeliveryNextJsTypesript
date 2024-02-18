import ProductCard from '../ui/productCard.js'
import Image from "next/image";
import { settings } from '../settings'
import '../js/app.js'
import Header from "../header/page.js"
export default function Home(pizzas, shushi) {
    return (
        <>
            <Header />
            <main className="page">
                <section className="categories">
                    <div className="categories__container swiper-container swiper">
                        <nav className="categories__list swiper-wrapper">
                            <a href="" className="categories__category swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img">
                                        <Image src="/Categories/Fire.svg" alt="Fire" width={32} height={32} />
                                    </div><span>Акції   </span>
                                </div>
                            </a>
                            <a href={settings.getURLPizza()} className="categories__category swiper-slide">
                                <div className="categories__category-inner ">
                                    <div className="categories__img"><Image src="/Categories/Pizza.svg" alt="Pizza" width={32} height={32} /></div><span>Піца</span>
                                </div>
                            </a>
                            <a href={settings.getURLSushi()} className="categories__category swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><Image src="/Categories/Sushi.svg" alt="Sushi" width={32} height={32} /></div><span>Суші</span>
                                </div>
                            </a>
                            <a href="" className="categories__category categories__category_notWorking swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><Image src="/Categories/Drink.svg" alt="Drink" width={32} height={32} /></div><span>Напої</span>
                                </div>
                            </a>
                            <a href="" className="categories__category categories__category_notWorking swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><Image src="/Categories/Snacks.svg" alt="Snacks" width={32} height={32} /></div><span>Закуски</span>
                                </div>
                            </a>
                            <a href="" className="categories__category categories__category_notWorking swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><Image src="/Categories/Combo.svg" alt="Combo" width={32} height={32} /></div><span>Комбо</span>
                                </div></a><a href="" className="categories__category categories__category_notWorking swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><Image src="/Categories/Dessert.svg" alt="Dessert" width={32} height={32} /></div><span>Десерти</span>
                                </div></a><a href="" className="categories__category categories__category_notWorking swiper-slide">
                                <div className="categories__category-inner">
                                    <div className="categories__img"><Image src="/Categories/Sauce.svg" alt="Sauce" width={32} height={32} /></div><span>Соуси</span>
                                </div></a></nav>
                    </div>
                </section>
                <section id="promotions" className="promotions">
                    <div className="promotions__container swiper-container swiper">
                        <div className="swiper-wrapper">
                            <div className="promotions__promo promo promo_orange swiper-slide">
                                <div className="promo__img"><Image src="/promotions/back1.png" alt="pizza" width={458} height={269} /></div>
                                <div className="promo__text">3 средние пиццы от 999 гривен</div>
                            </div>
                            <div className="promotions__promo promo promo_red swiper-slide">
                                <div className="promo__img"><Image src="/promotions/back2.svg" alt="pizza" width={279} height={116} /></div>
                                <div className="promo__text">Кэшбек 10% на самовывоз (доставка)</div>
                            </div>
                            <div className="promotions__promo promo promo_orange swiper-slide">
                                <div className="promo__img"><Image src="/promotions/back1.png" alt="pizza" width={458} height={269} /></div>
                                <div className="promo__text">3 средние пиццы от 999 гривен</div>
                            </div>
                            <div className="promotions__promo promo promo_red swiper-slide">
                                <div className="promo__img"><Image src="/promotions/back2.svg" alt="pizza" width={279} height={116} /></div>
                                <div className="promo__text">Кэшбек 10% на самовывоз (доставка)</div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="CheckAddress">
                    <div className="CheckAddress__container">
                        <div className="CheckAddress__inner">
                            <div className="CheckAddress__text">Проверить адрес доставки</div>
                            <form action="" className="CheckAddress__form">
                                <div className="CheckAddress__input"><Image src="/Common/Location.svg" alt="Location" width={20} height={20} />
                                    <input type="text" placeholder="Адрес" />
                                </div>
                                <button type="submit" value="Проверить" className="CheckAddress__send"><span>Проверить</span><Image src="/Common/Send.svg" alt="send" width={20} height={20} /></button>
                            </form>
                        </div>
                    </div>
                </section>
                <section id="pizza" className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <a href={settings.getURLPizza()}>
                                <h1 className="priceList__title">Пицца</h1>
                            </a>
                        </div>
                        <div className="priceList__grid">
                            {pizzas.map(pizza => {
                                return (<ProductCard productData={pizza} />)
                            })}
                        </div>
                    </div>
                </section>
                <section id="shushi" className="priceList">
                    <div className="priceList__container">
                        <div className="priceList__header">
                            <h1 className="priceList__title">Суши</h1>
                        </div>
                        <div className="priceList__grid">
                            {shushi.map(shushka => {
                                return (<ProductCard productData={shushka} />)
                            })}
                            {/* <div className="error"> <span className="error__code">сервер не отвечает</span>
                            </div> */}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}