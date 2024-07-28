'use client'
import { useContext, useEffect } from 'react';
import { MyContext } from '@/app/context/contextProvider';
import LogoutButton from "../components/LogoutButton";
import CartButton from '../components/CartButton';

import { refreshTabs, refreshSpollers } from '../components/startJS';
import { useSafeContext } from '../service/useSafeContext';


export default function Header() {
    const { userState } = useSafeContext(MyContext);
    useEffect(() => {
        refreshTabs()
        refreshSpollers()
    }, [userState])
    return (
        <>
            <header className="header">
                <div className="header__row header__container">
                    <div className="header__column">
                        {/* <div className="header__select">
                            <img src="/Common/Location.svg" alt="Location" height={20} width={20} />
                            <form action="/" method="post">
                                <select defaultValue="1" name="form[]" data-class-modif="form">
                                    <option value="1">Харків</option>
                                    <option value="2">Київ</option>
                                    <option value="3">Львів</option>
                                    <option value="4">Дніпро</option>
                                    <option value="5">Івано-Франківськ</option>
                                </select>
                            </form>
                        </div><a href="#" data-da=".menu__item_mobile, 767" className="header__link">Перевірити адресу</a>
                        <div className="header__text">Середній час доставки*: <span className="header__average-time">00:24:19</span></div> */}
                        <div id="time" data-da=".menu__body-wrapper, 767" className="header__text">Години роботи: з 11:00 до 23:00</div>
                    </div>
                    <div className="header__column">
                        {/* <div id="time" data-da=".menu__body-wrapper, 767" className="header__text">Години роботи: з 11:00 до 23:00</div> */}
                        <div className="header__buttons"
                            data-da=".menu__body, 767, first"
                        >
                            {!userState ? <>
                                <button data-popup="#registration" id="account" className="header__link header__link_account header__link_right">
                                    <img src="/Common/Account.svg" alt="Account" height={20} width={20} />
                                    <span>Увійти до аккаунту</span>
                                </button>
                            </> : <>
                                <div data-spollers="" className="spollers">
                                    <details className="spollers__item">
                                        <summary data-spoller-close className="spollers__title">{userState.first_name}</summary>
                                        <div className="spollers__body">
                                            <div className="spollers__body-inner">
                                                <ul className="menu__more menu-more">
                                                    {userState.role ?
                                                        <a href="/admin" id="account" className="header__link header__link_account header__link_right">
                                                            <span>Панель адміна</span>
                                                        </a>
                                                        : <></>}
                                                    <a href="/personal" id="account" className="header__link header__link_account header__link_right">
                                                        <span>Сторінка заказів</span>
                                                    </a>
                                                    <LogoutButton />
                                                </ul>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
                <div className="header__row header__container">
                    <div className="header__menu menu">
                        <a href={process.env.NEXT_PUBLIC_GLOBAL_URL} className="menu__logo">
                            <img src="/Header/Logo.svg" alt="logo" height={32} width={153} />
                        </a>
                        <button type="button" className="menu__icon icon-menu"><span></span></button>
                        <div className="menu__body-wrapper">
                            <nav className="menu__body">
                                <div className="menu__body-scroll">
                                    <ul className="menu__list">
                                        <li className="menu__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_PIZZA_URL} className="menu__link">Піца</a></li>
                                        <li className="menu__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_SUSHI_URL} className="menu__link">Суші</a></li>
                                        <li className="menu__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_DRINKS_URL} className="menu__link">Напої</a></li>
                                        <li className="menu__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_SNAKS_URL} className="menu__link">Закуски</a></li>
                                        <li className="menu__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_DESSERT_URL} className="menu__link">Десерти</a></li>
                                        <li className="menu__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_SAUCES_URL} className="menu__link">Соуси</a></li>
                                        <li className="menu__item"><a href="/" className="menu__link">Про компанію</a></li>
                                        <li className="menu__item"><a href="/" className="menu__link">Угода користувача</a></li>
                                        <li className="menu__item">
                                            <div data-spollers="" className="spollers">
                                                <details className="spollers__item">
                                                    <summary data-spoller-close className="spollers__title">Інше</summary>
                                                    <div className="spollers__body">
                                                        <div className="spollers__body-inner">
                                                            <ul className="menu__more menu-more">
                                                                <li className="menu__item"><a href="/" className="menu__link">Умови гарантії</a></li>
                                                                <li className="menu__item"><a href="/" className="menu__link">Ресторан</a></li>
                                                                <li className="menu__item"><a href="/" className="menu__link">Контакти</a></li>
                                                                <li className="menu__item"><a href="/" className="menu__link">Підтримка</a></li>
                                                                <li className="menu__item"><a href="/" className="menu__link">Відстежити замовлення</a></li>
                                                                <li className="menu__item menu__item_mobile"></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </details>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="menu__contact contact">
                                    <div className="contact__row">
                                        <div className="contact__item">

                                            <img src="/Common/phone.svg" alt="phone" height={20} width={20} /><a href="/"> +38 (067) 286-17-72</a>
                                        </div>
                                    </div>
                                    <div className="contact__row">
                                        <div className="contact__item">

                                            <img src="/Common/gps.svg" alt="gps" height={20} width={20} /><a href="/">Харків, просп. Гагаріна, 23</a>
                                        </div>
                                    </div>
                                    <div className="contact__row">
                                        <div className="contact__item">

                                            <img src="/Common/facebook.svg" alt="facebook" height={20} width={20} /><a href="/">Facebok</a>
                                        </div>
                                        <div className="contact__item">

                                            <img src="/Common/instagram.svg" alt="instagram" height={20} width={20} /><a href="/">Instagram</a>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                    <CartButton />
                </div>
            </header>
        </>
    );
}
