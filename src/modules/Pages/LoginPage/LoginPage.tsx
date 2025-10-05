import React, { useRef, useState } from 'react';
import './login-page.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/Auth/AuthContext';

export const LoginPage = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const { setIsLoggedIn } = useAuth();
    const UsernameRef = useRef<HTMLInputElement>(null);
    const PasswordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const sendToBack = async (e: React.FormEvent) => {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: login, password, rememberMe }),
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

                switch (data.roles) {
                    case 'main':
                        navigate('/home/mainInstaller');
                        break;
                    case 'administrator':
                        navigate('/home/owner');
                        break;
                    case 'salespeople':
                        navigate('/home/seller');
                        break;
                    default:
                        navigate('/');
                }

                setIsLoggedIn(['administrator', 'salespeople', 'main'].includes(data.roles));
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
            <div className="login-page__section">
                <h1 className="login-page__section-title">Вход</h1>
                <form className="login-page__section-form" onSubmit={sendToBack}>
                    <input
                        ref={UsernameRef}
                        className="login-page__section-input"
                        placeholder="Логин"
                        type="text"
                    />
                    <input
                        ref={PasswordRef}
                        className="login-page__section-input"
                        placeholder="Пароль"
                        type="password"
                    />

                    <div className="login-page__section-checkbox">
                        <input
                            type="checkbox"
                            className="login-page__section-checkbox-input"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="login-page__section-checkbox-label">
                            Запомнить меня
                        </label>
                    </div>

                    <button type="submit" className="login-page__section-button">
                        Войти
                    </button>
                </form>

            </div>
        </div>
    );
};
