'use client'
import loginController from '../AuthControllers/login'
import { show, hide } from '../components/loading'

import { MyContext } from '../context/contextProvider'
import { useContext } from 'react';

import { flsModules } from "../js/files/modules.js";


export default function LoginForm() {
    const { user, setUser } = useContext(MyContext);
    async function loginStart(query) {
        show()
        const res = await loginController(query)
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

    }
    return (
        <form method="post" action={loginStart} class="tabs__body">
            <div class="registration__tabs">
                <div class="registration__body-inner">
                    <div class="registration__input-row">
                        <div class="registration__input input-reg">
                            <label class="input-reg__title">пошта *</label>
                            <div class="input-reg__input">
                                <input name='email' type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$" required="required" />
                            </div>
                        </div>
                    </div>
                    <div class="registration__input-row">
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
                                Авторизуватися
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}