import React, {useRef, useState} from 'react';
import './loginPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/Auth/AuthContext';

export const LoginPage = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const { setIsLoggedIn } = useAuth();
    const UsernameRef = useRef<HTMLInputElement>(null);
    const PasswordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
        //deploy


    const sendToBack = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!UsernameRef.current || !PasswordRef.current) {
            alert('Поля не заполнены');
            return;
        }
        const login = UsernameRef.current.value;
        const password = PasswordRef.current.value;
        try {
            const response = await fetch(`/api/login?remember-me=${rememberMe}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: login,
                    password: password,
                    rememberMe: rememberMe
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
                localStorage.setItem('userRoles', data.roles);

                if (data.roles === 'main') {
                    navigate('/home/mainInstaller');
                } else if (data.roles === 'administrator') {
                    navigate('/home/owner');
                } else if (data.roles === 'salespeople') {
                    navigate('/home/seller');
                } else {
                    navigate('/');
                }

                if (data.roles === 'administrator' || data.roles === 'salespeople' || data.roles === 'main') {
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
                    <div className="checkbox_div">
                        <input className="checkbox" onChange={(e) => setRememberMe(e.target.checked)}
                               checked={rememberMe} type="checkbox" name="rememberMe"/>
                        <p className="p_login"
                        >
                            Запомнить меня
                        </p>
                    </div>
                    <button className="button-login shadowsSection" type="submit">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};
