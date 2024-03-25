'use client'
import registrationController from '../AuthControllers/registration'
import { show, hide } from '../components/loading'
import { MyContext } from '../context/contextProvider'
import { useContext } from 'react';

import { flsModules } from "../js/files/modules.js";

export default function registrationForm() {
    const { user, setUser } = useContext(MyContext);
    async function registrationStart(query) {
        show()
        const res = await registrationController(query)
        if (res[0]) {
            console.log(res[1])
            localStorage.setItem('accessToken', res[2])
            setUser(res[3])
            hide()
            flsModules.popup.close('#registration')
        } else {
            alert(res[1])
            hide()
        }
        return false;
    }
    return (
        <form method="post" action={registrationStart} class="tabs__body">
            <div class="registration__tabs">
                <div class="registration__body-inner">
                    <div class="registration__input-row">
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">ім’я *</label>
                            <div class="input-reg__input">
                                <input name='name' type="text" pattern="^[A-Za-zА-Яа-яЁё]{1,50}$" required="required" />
                            </div>
                        </div>
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">Прізвище *</label>
                            <div class="input-reg__input">
                                <input name='surname' type="text" pattern="^[A-Za-zА-Яа-яЁё]{1,50}$" required="required" />
                            </div>
                        </div>
                    </div>
                    <div class="registration__input-row">
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">телефон *</label>
                            <div class="input-reg__input"><span>+38</span>
                                <input name='phone' type="tel" pattern="(067|097)[0-9]{7}" required="required" />
                            </div>
                        </div>
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">пошта *</label>
                            <div class="input-reg__input">
                                <input name='email' type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$" required="required" />
                            </div>
                        </div>
                    </div>
                    <div class="registration__input-row">
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">вулиця *</label>
                            <div class="input-reg__input">
                                <input name='street' type="text" pattern="^[A-Za-zА-Яа-яЁё]{1,100}$" required="required" />
                            </div>
                        </div>
                    </div>
                    <div class="registration__input-row">
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">будинок&nbsp;*</label>
                            <div class="input-reg__input">
                                <input name='house' type="number" pattern="^[0-9]{4}$" required="required" />
                            </div>
                        </div>
                    </div>
                    <div class="registration__input-row">
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">під’їзд</label>
                            <div class="input-reg__input">
                                <input name='entrance' type="number" pattern="^[0-9]{4}$" />
                            </div>
                        </div>
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">поверх </label>
                            <div class="input-reg__input">
                                <input name='floor' type="number" pattern="^[0-9]{4}$" />
                            </div>
                        </div>
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">квартира</label>
                            <div class="input-reg__input">
                                <input name='apartment' type="number" pattern="^[0-9]{4}$" />
                            </div>
                        </div>
                    </div>
                    <div class="registration__input-row">
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">код от домофона</label>
                            <div class="input-reg__input">
                                <input name='intercom_code' type="number" />
                            </div>
                        </div>
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">Пароль *</label>
                            <div class="input-reg__input">
                                <input name='password' type="password" required="required" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="registration__input-row">
                    <div class="registration__input input-reg input-reg_submit">
                        <div class="input-reg__input">
                            <button type="submit">
                                Зареєструватися
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}