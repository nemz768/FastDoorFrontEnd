import '../styles/header.css';
import logo from '../assets/logo.svg';
import {Link} from 'react-router-dom'
import {useEffect, useState} from "react";

export const Header = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const getHeader = async () => {
            try {
                const response = await fetch("/api/login", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json();

                if (data.roles === "administrator" || data.roles === "salespeople") {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            }
            catch(err) {
                console.error(err);
                setIsLoggedIn(false);
            }
        }
        getHeader();

    }, [])




    return (
        <header className="header">
            <Link to='/'><img src={logo} alt="dverka"/></Link>

            {isLoggedIn ? (
                <nav className="header-nav">
                    <button>Выйти</button>
                    <Link to='/reg'>toMainPage</Link>
                </nav>
            ) : (
                <nav className="header-nav">
                    <Link to='/login'>Войти</Link>
                    <Link to='/reg'>Регистрация</Link>
                </nav>
            )
            }
         </header>
    );
};
