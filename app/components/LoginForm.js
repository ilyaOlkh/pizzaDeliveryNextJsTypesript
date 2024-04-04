'use client'
import loginController from '../AuthControllers/login'
import { show, hide } from '../components/loading'

import { MyContext } from '../context/contextProvider'
import { useContext } from 'react';

import { flsModules } from "../js/files/modules.js";


export default function LoginForm() {
    const { user, setUser } = useContext(MyContext);
    async function loginStart(event) {
        event.preventDefault();
        show()
        const formData = new FormData(event.target);
        const res = await loginController(formData)
        if (res[0]) {
            localStorage.setItem('accessToken', res[2])
            flsModules.popup.close('#registration')
            setUser(res[3])
            hide()
        } else {
            alert(res[1])
            hide()
        }

    }
    return (
        <form method="post" onSubmit={loginStart} className="tabs__body">
            <div className="registration__tabs">
                <div className="registration__body-inner">
                    <div className="registration__input-row">
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">пошта *</label>
                            <div className="input-reg__input">
                                <input name='email' type="email" pattern=".+@.+\..+" required="required" />
                            </div>
                        </div>
                    </div>
                    <div className="registration__input-row">
                        <div className="registration__input input-reg">
                            <label className="input-reg__title">Пароль *</label>
                            <div className="input-reg__input">
                                <input name='password' type="password" required="required" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="registration__input-row">
                    <button type="submit" className="registration__input input-reg input-reg_submit">
                        <div className="input-reg__input">
                            Авторизуватися
                        </div>
                    </button>
                </div>
            </div>
        </form>
    );
}