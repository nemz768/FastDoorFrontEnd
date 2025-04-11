import React from 'react';
import '../styles/login.css'


const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-section">
                <h1 className="loginTitle">Вход</h1>
                <form className="loginForm" method="POST" id="loginForm">
                    <input className="shadows-input" placeholder="Логин" type="text" name="username" id="username"/>
                    <input className="shadows-input" placeholder="Пароль" type="password" name="password"
                           id="password"/>
                    <p><a>Нажми</a> для регистрации</p>
                    <p><input className="checkbox" type="checkbox" name="rememberMe"/> Запомнить меня</p>
                    <button className="button-login shadowsSection" type="submit">Войти</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;