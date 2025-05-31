import '../styles/header.css';
import logo from '../assets/logo.svg';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import { useAuth } from './Auth/AuthContext.jsx';

export const Header = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [link, setLink] = useState(false);

    // Проверяем авторизацию при изменении маршрута
    useEffect(() => {
         const storedRoles = localStorage.getItem('userRoles');
        if (storedRoles && (storedRoles === 'administrator' || storedRoles === 'salespeople')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [location.pathname, setIsLoggedIn]);




    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/logout", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await response;

            console.log(data)
            localStorage.removeItem('userRoles'); // Очищаем роль при выходе
            setIsLoggedIn(false);
            navigate('/');

        }catch (error) {
            console.log(error);
        }



    };

    const controlRedirect = () => {
        if (localStorage.getItem('userRoles') === "administrator") {
            navigate('/home/admin');
        }else if (localStorage.getItem('userRoles') === "salespeople") {
            navigate('/home/seller');
        }else {
            alert("Error redirect");
            window.location.reload();
        }
    }


    const getHeader = () => {
        if (isLoggedIn) {
            if (localStorage.getItem('userRoles') === "administrator") {
                return (
                    <nav className="header-nav">
                        <a href="#" onClick={handleLogout}>Выйти</a>
                        <a href="#" onClick={controlRedirect}>К своей странице</a>
                        <p>Это admin</p>
                    </nav>
                )
            }
        }else if (localStorage.getItem('userRoles') === "salespeople") {
            return (
                <nav className="header-nav">
                    <a href="#" onClick={handleLogout}>Выйти</a>
                    <a href="#" onClick={controlRedirect}>К своей странице</a>
                    <p>Это salespeople</p>
                </nav>
            )
        }else if (localStorage.getItem('userRoles') === "main") {
            return (
                <nav className="header-nav">
                    <a href="#" onClick={handleLogout}>Выйти</a>
                    <a href="#" onClick={controlRedirect}>К своей странице</a>
                    <p>Это mainInstaller</p>
                </nav>
            )
        }else {
            return (
                <nav className="header-nav">
                    <Link to="/login">Войти</Link>
                    <Link to="/reg">Регистрация</Link>
                    <p>user</p>
                </nav>
            )
        }

    }


    return (
        <header className="header">
            <Link to="/">
                <img src={logo} alt="dverka" />
            </Link>
            {getHeader}
        </header>
    );
};
