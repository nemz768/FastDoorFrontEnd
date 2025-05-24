import '../styles/header.css';
import logo from '../assets/logo.svg';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './Auth/AuthContext.jsx';

export const Header = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const location = useLocation();

    // Проверяем авторизацию при изменении маршрута
    useEffect(() => {
        const storedRoles = localStorage.getItem('userRoles');
        if (storedRoles && (storedRoles === 'administrator' || storedRoles === 'salespeople')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [location.pathname, setIsLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('userRoles'); // Очищаем роль при выходе
        setIsLoggedIn(false);
    };

    return (
        <header className="header">
            <Link to="/">
                <img src={logo} alt="dverka" />
            </Link>
            {isLoggedIn ? (
                <nav className="header-nav">
                    <button onClick={handleLogout}>Выйти</button>
                    <Link to="/reg">toMainPage</Link>
                </nav>
            ) : (
                <nav className="header-nav">
                    <Link to="/login">Войти</Link>
                    <Link to="/reg">Регистрация</Link>
                </nav>
            )}
        </header>
    );
};

export default Header;