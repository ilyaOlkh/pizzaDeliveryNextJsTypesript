'use client'

import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'

import { useContext } from 'react';
import { MyContext } from '@/app/context/contextProvider';


export default function popupReg() {
    const { userState } = useContext(MyContext);
    if (!userState) {
        return <>
            <div id="registration" aria-hidden="true" className="popup popup-window registration">
                <div className="popup__wrapper">
                    <div className="popup__content registration__content">
                        <button data-close="data-close" type="button" className="popup__close">
                            <img src="/Common/CrossWhite.svg" alt="Cross" />
                        </button>
                        <div data-tabs className="popup__body registration__body">
                            <nav data-tabs-titles className="tabs__navigation">
                                <button type="button" className="tabs__title _tab-active">Регистрация</button>
                                <button type="button" className="tabs__title">Авторизація</button>
                            </nav>
                            <div data-tabs-body className="tabs__content">
                                <RegistrationForm />
                                <LoginForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    } else {
        return <></>
    }
}