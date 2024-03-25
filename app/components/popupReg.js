'use client'
import loginStart from '../authClientServices/login'
import registrationStart from '../authClientServices/registration'

import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'

import { useContext } from 'react';
import { MyContext } from '@/app/context/contextProvider';


export default function popupReg() {
    const { userState } = useContext(MyContext);
    if (!userState) {
        return <>
            <div id="registration" aria-hidden="true" class="popup popup-window registration">
                <div class="popup__wrapper">
                    <div class="popup__content registration__content">
                        <button data-close="data-close" type="button" class="popup__close">
                            <img src="@img/Common/CrossWhite.svg" alt="Cross" />
                        </button>
                        <div data-tabs class="popup__body registration__body">
                            <nav data-tabs-titles class="tabs__navigation">
                                <button type="button" class="tabs__title _tab-active">Регистрация</button>
                                <button type="button" class="tabs__title">Авторизація</button>
                            </nav>
                            <div data-tabs-body class="tabs__content">
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