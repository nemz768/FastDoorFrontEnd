import React, { useState } from 'react';
import './popup.css';
import { Link } from "react-router-dom";
import { NavItems } from "../../Interfaces/Interfaces";
import { LogoutApi } from "../../Api/getLogoutApi/LogoutApi";
import { GetSessionApi } from "../../Api/getSessionApi/GetSessionApi";

interface HeaderProps {
    navItems?: NavItems[];
}

export const Popup = ({ navItems = [] }: HeaderProps) => {
    const [showNavbar, setShowNavbar] = useState(false);
    const [bgColor, setBgColor] = useState('#4E3629');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    return (
        <>
            <div
                style={{ background: bgColor }}
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
                    {navItems.map((item) => (
                        <Link className="navbar_address" to={item.route} key={item.route}>
                            {item.label}
                        </Link>
                    ))}
                    {isLoggedIn === true && <LogoutApi />}

                    <GetSessionApi setIsLoggedIn={setIsLoggedIn} />
                </nav>
            )}
        </>
    );
};
