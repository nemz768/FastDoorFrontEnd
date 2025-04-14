import React from 'react';
import '../styles/registerPage.css'
export const RegisterPage = () => {
    return (
        <div className="registerBlock">
            <div className="registration">
                <h1>Регистрация</h1>
                <form className="form-register" method="POST" id="registerForm">
                    <label htmlFor="username">Логин: </label>
                    <input type="text" id="username" name="username"/>

                    <label htmlFor="password">Пароль: </label>
                    <input type="password" id="password" name="password"/>

                    <label htmlFor="confirm">Подтвердить Пароль: </label>
                    <input type="password" id="confirm" name="confirm"/>

                    <label htmlFor="fullname">ФИО: </label>
                    <input type="text" id="fullname" name="fullname"/>

                    <label htmlFor="email">Почта: </label>
                    <input type="email" id="email" name="email"/>

                    <label htmlFor="phone">Номер телефона: </label>
                    <input type="text" id="phone" name="phone"
                    />
                    <label htmlFor="role">Роль: </label>
                    <input type="text" id="role" name="role"/>

                    <button className="registration_button" type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
};
