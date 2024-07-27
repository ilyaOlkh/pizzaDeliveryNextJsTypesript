'use client'
import registrationController from '../AuthControllers/registration'
import { show, hide } from './loading'
import { MyContext } from '../context/contextProvider'
import { FormEvent, FormEventHandler, useContext } from 'react';

import { flsModules } from "../js/files/modules";
import { useSafeContext } from '../service/useSafeContext';

export default function registrationForm() {
    const { userState, setUser } = useSafeContext(MyContext);
    async function registrationStart(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        show()
        const formData = new FormData(event.currentTarget);
        const res = await registrationController(formData)
        if (res[0]) {
            localStorage.setItem('accessToken', res[2])
            setUser(res[3])
            hide()
            flsModules.popup.close('#registration')
        } else {
            alert(res[1])
            hide()
        }
    }
    return (
        <form method="post" onSubmit={registrationStart} className="tabs__body">
            <div className="registration__tabs">
                <div className="registration__body-inner">
                    <div className="registration__input-row">
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">ім’я *</label>
                            <div className="input-reg__input">
                                <input name='name' type="text" pattern="^[А-ЩЬЮЯҐІЇЄа-щьюяґіїє]{1,50}$" required />
                            </div>
                        </div>
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">Прізвище *</label>
                            <div className="input-reg__input">
                                <input name='surname' type="text" pattern="^[А-ЩЬЮЯҐІЇЄа-щьюяґіїє]{1,50}$" required />
                            </div>
                        </div>
                    </div>
                    <div className="registration__input-row">
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">телефон *</label>
                            <div className="input-reg__input"><span>+38</span>
                                <input name='phone' type="tel" pattern="(020|039|050|063|066|067|068|073|075|077|089|091|092|093|094|095|096|097|098|099)[0-9]{7}" required />
                            </div>
                        </div>
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">пошта *</label>
                            <div className="input-reg__input">
                                <input name='email' type="email" pattern=".+@.+\..+" required />
                            </div>
                        </div>
                    </div>
                    <div className="registration__input-row">
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">вулиця *</label>
                            <div className="input-reg__input">
                                <input name='street' type="text" pattern="^[A-Za-zА-Яа-яЁё]{1,100}$" required />
                            </div>
                        </div>
                    </div>
                    <div className="registration__input-row">
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">будинок&nbsp;*</label>
                            <div className="input-reg__input">
                                <input name='house' type="number" pattern="^[0-9]{4}$" required />
                            </div>
                        </div>
                    </div>
                    <div className="registration__input-row">
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">під’їзд</label>
                            <div className="input-reg__input">
                                <input name='entrance' type="number" pattern="^[0-9]{4}$" />
                            </div>
                        </div>
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">поверх </label>
                            <div className="input-reg__input">
                                <input name='floor' type="number" pattern="^[0-9]{4}$" />
                            </div>
                        </div>
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">квартира</label>
                            <div className="input-reg__input">
                                <input name='apartment' type="number" pattern="^[0-9]{4}$" />
                            </div>
                        </div>
                    </div>
                    <div className="registration__input-row">
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">код от домофона</label>
                            <div className="input-reg__input">
                                <input name='intercom_code' type="number" />
                            </div>
                        </div>
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">Пароль *</label>
                            <div className="input-reg__input">
                                <input name='password' type="password" required />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="registration__input-row">
                    <button type="submit" className="registration__input input-reg input-reg_submit">
                        <div className="input-reg__input">
                            Зареєструватися
                        </div>
                    </button>
                </div>
            </div>
        </form>
    );
}