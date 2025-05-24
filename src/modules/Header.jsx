import '../styles/header.css';
import logo from '../assets/logo.svg';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './Auth/AuthContext.jsx';

export const Header = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
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

    const controlRedirect = () => {
        if (localStorage.getItem('userRoles') === "administrator") {
            navigate('/403');
        }else if (localStorage.getItem('userRoles') === "salespeople") {
            navigate('/home/seller');
        }else {
            alert("Error redirect");
            window.location.reload();
        }
    }

    return (
        <header className="header">
            <Link to="/">
                <img src={logo} alt="dverka" />
            </Link>
            {isLoggedIn ? (
                <nav className="header-nav">
                    <a href="#" onClick={handleLogout}>Выйти</a>
                    <a href="#" onClick={}>К своей странице</a>
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