import React, {useState} from 'react';
import '../styles/login.css'
import {Link} from "react-router-dom";


const LoginPage = () => {
    const [InputValue, setInputValue] = useState({
        inputUser: '',
        inputPass: '',
    });

    function sendToBack()
    {
        console.log(InputValue)
            fetch("/api/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: InputValue.inputUser,
                    password: InputValue.inputPass
                })
            })
                .then((res)=> console.log(res.json()))
                .then((data) => console.log('Server response: ', data.text()))
                .catch((err) => console.error(err));
    }
    return (
        <div className="login-page">
            <div className="login-section">
                <h1 className="loginTitle">Вход</h1>
                <form className="loginForm" method="POST" id="loginForm">
                    <input value={InputValue.inputUser} onChange={
                        (e) => {
                            setInputValue({
                                ...InputValue,
                                inputUser: e.target.value
                            })
                        }
                    } className="shadows-input"  placeholder="Логин" type="text" name="username" id="username"/>
                    <input  className="shadows-input" value={InputValue.inputPass} onChange={
                        (e) => {
                            setInputValue({
                                ...InputValue,
                                inputPass: e.target.value
                            })
                        }
                    } placeholder="Пароль" type="password" name="password" id="password"/>

                    <p><a>Нажми</a> для регистрации</p>

                    <p><input className="checkbox" type="checkbox" name="rememberMe"/> Запомнить меня</p>

                 <Link to="/check"><button onClick={() => {
                     sendToBack()
                 }} className="button-login shadowsSection" type='submit' >Войти</button>
                 </Link>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;