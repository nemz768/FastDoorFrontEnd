import React, { useRef } from 'react';
import '../../styles/stylePages/loginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext.jsx';

const LoginPage = () => {
    const { setIsLoggedIn } = useAuth();
    const UsernameRef = useRef(null);
    const PasswordRef = useRef(null);
    const navigate = useNavigate();

    const sendToBack = async (e) => {
        e.preventDefault();
        const login = UsernameRef.current.value;
        const password = PasswordRef.current.value;
        try {
            const response = await fetch('http://fast-door.ru/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: login,
                    password: password,
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Ошибка: Неверный логин или пароль');
                    return;
                }
                throw new Error(`HTTP ошибка! Статус: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data && data.roles) {
                // Сохраняем роль в localStorage
                localStorage.setItem('userRoles', data.roles);

                if (data.roles === 'main') {
                    navigate('/home/mainInstaller');
                } else if (data.roles === 'administrator') {
                    navigate('/home/admin');
                } else if (data.roles === 'salespeople') {
                    navigate('/home/seller');
                } else {
                    navigate('/');
                }

                if (data.roles === 'administrator' || data.roles === 'salespeople') {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } else {
                console.error('Неверный формат ответа API:', data);
                navigate('/');
            }

            UsernameRef.current.value = '';
            PasswordRef.current.value = '';
        } catch (err) {
            console.error('Ошибка при запросе:', err);
            alert('Произошла ошибка при входе');
        }
    };

    return (
        <div className="login-page">
            <div className="login-section">
                <h1 className="loginTitle">Вход</h1>
                <form onSubmit={sendToBack} className="loginForm" id="loginForm">
                    <input
                        ref={UsernameRef}
                        className="shadows-input"
                        placeholder="Логин"
                        type="text"
                        name="username"
                        id="username"
                    />
                    <input
                        ref={PasswordRef}
                        className="shadows-input"
                        placeholder="Пароль"
                        type="password"
                        name="password"
                        id="password"
                    />
                    <p>
                        <Link style={{ color: 'black' }} to="/reg">
                            Нажми
                        </Link>
                        для регистрации
                    </p>
                    <div className="checkbox_div">
                        <input className="checkbox" type="checkbox" name="rememberMe" />
                        <p className="p_login"> Запомнить меня</p>
                    </div>
                    <button className="button-login shadowsSection" type="submit">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;