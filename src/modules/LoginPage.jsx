import React, {useState} from 'react';
import '../styles/login.css'


const LoginPage = () => {



    // НЕ СТОИТ ХРАНИТЬ ПАРОЛИ В USESTATE -> USEREF
    const [InputValue, setInputValue] = useState({
        inputUser: '',
        inputPass: '',
    });

    function sendToBack() {
            fetch("http://127.0.0.1:8080/api/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: InputValue.inputUser,
                    password: InputValue.inputPass
                })
            })
                .then((res) => res.text())
                .then((data) =>   console.log('Server response: ', data))
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

                    <button onClick={(e) => {
                        e.preventDefault();
                        sendToBack()
                    }} className="button-login shadowsSection" >Войти</button>

                </form>
            </div>
        </div>
    );
};

export default LoginPage;