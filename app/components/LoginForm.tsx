'use client'
import loginController from '../AuthControllers/login'
import { show, hide } from './loading'

import { MyContext } from '../context/contextProvider'
import { FormEvent, FormEventHandler } from 'react';

import { flsModules } from "../js/files/modules";
import { useSafeContext } from '../service/useSafeContext';


export default function LoginForm(): JSX.Element {
    const { userState, setUser } = useSafeContext(MyContext);
    async function loginStart(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        show()
        console.log(event.currentTarget)
        const formData: FormData = new FormData(event.currentTarget);
        console.log(formData)

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
                                <input name='email' type="email" pattern=".+@.+\..+" required />
                            </div>
                        </div>
                    </div>
                    <div className="registration__input-row">
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
                            Авторизуватися
                        </div>
                    </button>
                </div>
            </div>
        </form>
    );
}