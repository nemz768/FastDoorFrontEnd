import React, { useState } from 'react';
import '../../styles/popup.css';
import { Link } from "react-router-dom";

export const Popup = () => {
    const [showNavbar, setShowNavbar] = useState(false);
    const [bgColor, setBgColor] = useState('#4E3629');

    return (
        <>
            <div
                style={{ background: `${bgColor}` }}
                onClick={() => {
                    setShowNavbar(prev => !prev);
                    setBgColor(showNavbar ? "#4E3629" : "#E9D6C7");
                }}
                className={`popup_adaptive ${showNavbar ? 'active' : ''}`}
            >
                <div className="popup_line"></div>
                <div className="popup_line"></div>
                <div className="popup_line"></div>
            </div>

            {showNavbar && (
                <nav className={`popup_navbar ${showNavbar ? 'active' : ''}`}>
                    <Link to='/login'>Войти</Link>
                    <Link to='/reg'>Регистрация</Link>
                </nav>
            )}
        </>
    );
};
