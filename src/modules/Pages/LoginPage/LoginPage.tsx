import React, { useRef, useState } from 'react';
import './login-page.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store/store';

export const LoginPage = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();


    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        const username = usernameRef.current?.value.trim();
        const password = passwordRef.current?.value;


        if (!username || !password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        dispatch(login({ username, password, rememberMe }))
            .unwrap() // ← позволяет обрабатывать результат как Promise
            .then((result:any) => {
                // Успешный вход — навигация по ролям
                const roles = result.roles;

                switch (roles) {
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
            })
            .catch((err) => {
                console.error('Login failed:', err);
            });
    };

    return (
            <div className="login-page">
                <div className="login-page__section">
                    <h1 className="login-page__section-title">Вход</h1>

                    {/* Показ ошибки из Redux */}
                    {error && (
                        <div className="login-page__error">
                            {error}
                        </div>
                    )}

                    <form className="login-page__section-form" onSubmit={handleSubmit}>
                        <input
                            ref={usernameRef}
                            className="login-page__section-input"
                            placeholder="Логин"
                            type="text"
                            disabled={loading} // блокируем при загрузке
                        />
                        <input
                            ref={passwordRef}
                            className="login-page__section-input"
                            placeholder="Пароль"
                            type="password"
                            disabled={loading}
                        />

                        <div className="login-page__section-checkbox">
                            <input
                                type="checkbox"
                                className="login-page__section-checkbox-input"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={loading}
                            />
                            <label className="login-page__section-checkbox-label">
                                Запомнить меня
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="login-page__section-button"
                            disabled={loading}
                        >
                            {loading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>
                </div>
            </div>
    );
};