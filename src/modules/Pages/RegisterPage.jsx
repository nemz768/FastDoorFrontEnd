import React, {useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../styles/stylePages/registerPage.css'

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

        const username = refs.inputUser.current.value;
        const password = refs.inputPass.current.value;
        const conf = refs.confirm.current.value;
        const fullname = refs.fullname.current.value;
        const email = refs.email.current.value;
        const phone = refs.phone.current.value;
        const role = refs.role.current.value;

       await fetch("/api/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                confirm: conf,
                fullname: fullname,
                email: email,
                phone: phone,
                role: role
            })
        })
            .then((res)=> res.json())
            .then((data) => {
                console.log('Server response: ', data)
                navigate("/login")
            })
            .catch((err) => console.error(err));
    }


    return (
        <div className="registerBlock">
            <div className="registration">
                <h1>Регистрация</h1>
                <form onSubmit={registerToBack} className="form-register" method="POST" id="registerForm">
                    <label htmlFor="username">Логин: </label>
                    <input className="input_RegisterPage shadows-input" ref={refs.inputUser} type="text" id="username" name="username"/>

                    <label htmlFor="password">Пароль: </label>
                    <input className="input_RegisterPage shadows-input" ref={refs.inputPass} type="password" id="password" name="password"/>

                    <label htmlFor="confirm">Подтвердить Пароль: </label>
                    <input className="input_RegisterPage shadows-input" ref={refs.confirm} type="password" id="confirm" name="confirm"/>

                    <label htmlFor="fullname">ФИО: </label>
                    <input className="input_RegisterPage shadows-input" ref={refs.fullname} type="text" id="fullname" name="fullname"/>

                    <label htmlFor="email">Почта: </label>
                    <input className="input_RegisterPage shadows-input" ref={refs.email} type="email" id="email" name="email"/>

                    <label htmlFor="phone">Номер телефона: </label>
                    <input className="input_RegisterPage shadows-input" ref={refs.phone}  type="text" id="phone" name="phone"
                    />
                    <label htmlFor="role">Роль: </label>
                    <input className="input_RegisterPage shadows-input" ref={refs.role} type="text" id="role" name="role"/>

                        <button className="registration_button" type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
};
