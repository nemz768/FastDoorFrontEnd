import React, {useRef} from 'react';
import '../styles/login.css'
import {Link} from "react-router-dom";


const LoginPage = () => {
    const UsernameRef = useRef(null);
    const PasswordRef = useRef(null);

    const sendToBack = async (e) => {
        e.preventDefault();
        console.log(UsernameRef.current.value)
        console.log(PasswordRef.current.value)
        const login = UsernameRef.current.value;
        const password = PasswordRef.current.value;
            await fetch("/api/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: login,
                    password: password
                })
            })
                .then((res)=> res.json())
                .then((data) => console.log('Server response: ', data.message))
                .catch((err) => console.error(err));
        UsernameRef.current.value = '';
        PasswordRef.current.value = '';

    }
    return (
        <div className="login-page">
            <div className="login-section">
                <h1 className="loginTitle">Вход</h1>
                <form onSubmit={sendToBack} className="loginForm" method="POST" id="loginForm">
                    <input ref={UsernameRef} className="shadows-input"  placeholder="Логин" type="text" name="username" id="username"/>
                    <input ref={PasswordRef} className="shadows-input" placeholder="Пароль" type="password" name="password" id="password"/>

                    <p><a>Нажми</a> для регистрации</p>

                    <p><input className="checkbox" type="checkbox" name="rememberMe"/> Запомнить меня</p>

                <button className="button-login shadowsSection" type='submit' >Войти</button>

                </form>
            </div>
        </div>
    );
};

export default LoginPage;