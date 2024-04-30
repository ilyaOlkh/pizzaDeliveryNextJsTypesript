'use client'

export default function Footer() {
    return (
        <>
            <footer className="footer">
                {/* <a href={process.env.NEXT_PUBLIC_GLOBAL_URL} className="footer__row footer__logo">
                    <img src="/Header/Logo.svg" alt="logo" height={32} width={176} />
                </a> */}
                <div className="footer__container">
                    <nav className="footer__grid">
                        <div className="footer__column">
                            <div data-spollers="768,max" className="spollers">
                                <details className="spollers__item">
                                    <summary data-spoller-close className="spollers__title">Товари</summary>
                                    <div className="spollers__body">
                                        <div className="spollers__body-inner">
                                            <ul className="footer__list">
                                                <li className="footer__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_PIZZA_URL} className="menu__link">Піца</a></li>
                                                <li className="footer__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_SUSHI_URL} className="menu__link">Суші</a></li>
                                                <li className="footer__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_DRINKS_URL} className="menu__link">Напої</a></li>
                                                <li className="footer__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_SNAKS_URL} className="menu__link">Закуски</a></li>
                                                <li className="footer__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_DESSERT_URL} className="menu__link">Десерти</a></li>
                                                <li className="footer__item"><a href={process.env.NEXT_PUBLIC_GLOBAL_URL + process.env.NEXT_PUBLIC_SAUCES_URL} className="menu__link">Соуси</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                        <div className="footer__column">
                            <div data-spollers="768,max" className="spollers">
                                <details className="spollers__item">
                                    <summary data-spoller-close className="spollers__title">Піца парадіз</summary>
                                    <div className="spollers__body">
                                        <div className="spollers__body-inner">
                                            <ul className="footer__list">
                                                <li className="footer__item">
                                                    Про компанію
                                                </li>
                                                <li className="footer__item">
                                                    Угода користувача
                                                </li>
                                                <li className="footer__item">
                                                    Умови гарантії
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                        <div className="footer__column">
                            <div data-spollers="768,max" className="spollers">
                                <details className="spollers__item">
                                    <summary data-spoller-close className="spollers__title">Контакти</summary>
                                    <div className="spollers__body">
                                        <div className="spollers__body-inner">
                                            <ul className="footer__list">
                                                <li className="footer__item">
                                                    <div className="footer__contact contact">
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
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className="footer__row footer__row_orange">
                    © Copyright 2024 — Піца парадіз
                </div>
            </footer >
        </>
    )
}