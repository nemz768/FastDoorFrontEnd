import React, {useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/registerPage.css'

export const RegisterPage = () => {


    const refs = {
        inputUser: useRef(null),
        inputPass: useRef(null),
        confirm: useRef(null),
        fullname: useRef(null),
        email: useRef(null),
        phone: useRef(null),
        role: useRef(null)
    }
    const navigate = useNavigate();

    const registerToBack = async () =>
    {
        console.log(refs.inputUser.current.value)

       await fetch("/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: refs.inputUser.current.value,
                password: refs.inputPass.current.value,
                confirm: refs.confirm.current.value,
                fullname: refs.fullname.current.value,
                email: refs.email.current.value,
                phone: refs.phone.current.value,
                role: refs.role.current.value
            })
        })
            .then((res)=> res.json())
            .then((data) => console.log('Server response: ', data))
            .then(()=> navigate("/login"))
            .catch((err) => console.error(err));
    }


    return (
        <div className="registerBlock">
            <div className="registration">
                <h1>Регистрация</h1>
                <form onSubmit={registerToBack} className="form-register" method="POST" id="registerForm">
                    <label htmlFor="username">Логин: </label>
                    <input ref={refs.inputUser.current.value} type="text" id="username" name="username"/>

                    <label htmlFor="password">Пароль: </label>
                    <input ref={refs.inputPass.current.value} type="password" id="password" name="password"/>

                    <label htmlFor="confirm">Подтвердить Пароль: </label>
                    <input ref={refs.confirm.current.value} type="password" id="confirm" name="confirm"/>

                    <label htmlFor="fullname">ФИО: </label>
                    <input ref={refs.fullname.current.value} type="text" id="fullname" name="fullname"/>

                    <label htmlFor="email">Почта: </label>
                    <input ref={refs.email.current.value} type="email" id="email" name="email"/>

                    <label htmlFor="phone">Номер телефона: </label>
                    <input ref={refs.phone.current.value}  type="text" id="phone" name="phone"
                    />
                    <label htmlFor="role">Роль: </label>
                    <input ref={refs.role.current.value} type="text" id="role" name="role"/>

                        <button className="registration_button" type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
};
