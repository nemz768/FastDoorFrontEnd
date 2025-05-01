import '../styles/header.css';
import logo from '../assets/logo.svg';
import {Link} from 'react-router-dom'

import React from "react";

export const Header = () => {
    return (
        <header className="header">
            <Link to='/'><img src={logo} alt="dverka"/></Link>
            <nav className="header-nav">
                <Link to='/login'>Войти</Link>
                <Link to='/reg'>Регистрация</Link>
            </nav>
         </header>
    );
};
