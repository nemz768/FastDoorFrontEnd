import React, {useRef} from 'react';
import '../../styles/stylePages/loginPage.css'
import {Link, useNavigate} from "react-router-dom";

const LoginPage = () => {
    const UsernameRef = useRef(null);
    const PasswordRef = useRef(null);
    const navigate = useNavigate();

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
                .then(res=> res.json()
                )
                .then((data) => {
                    console.log('Server response: ', data.roles)
                    if (data.roles === 'main') {
                        navigate('/404')
                        //'/home/mainInstaller'
                    }
                    else if (data.roles === 'administrator') {
                        navigate('/404')
                    }
                    else if (data.roles === 'salespeople') {
                        navigate('/home/seller')
                    }else {
                        navigate('/')
                    }
                })
                .catch((err) => console.error(err));
        UsernameRef.current.value = '';
        PasswordRef.current.value = '';

        // /api/logout
    }
    return (
        <div className="login-page">
            <div className="login-section">

                <h1 className="loginTitle">Вход</h1>

                <form onSubmit={sendToBack} className="loginForm" id="loginForm">
                    <input ref={UsernameRef} className="shadows-input"  placeholder="Логин" type="text" name="username" id="username"/>

                    <input ref={PasswordRef} className="shadows-input" placeholder="Пароль" type="password" name="password" id="password"/>

                    <p><Link style={{color: "black"}} to="/reg">Нажми</Link> для регистрации</p>
                    <div className='checkbox_div'>
                        <input className="checkbox" type="checkbox" name="rememberMe"/>
                        <p className="p_login"> Запомнить меня</p>
                    </div>
                    <button className="button-login shadowsSection" type='submit'>Войти</button>

                </form>
            </div>
        </div>
    );
};

export default LoginPage;