import './header.css';
import { Link } from 'react-router-dom';
import React from "react";
import { NavItems } from "../../Interfaces/Interfaces";
import { LogoutApi } from "../../Api/getLogoutApi/LogoutApi";
import { GetSessionApi } from "../../Api/getSessionApi/GetSessionApi";

interface HeaderProps {
    navItems?: NavItems[];
}

export const Header = ({ navItems = [] }: HeaderProps) => {
    return (
        <header className="header">
            <div className="navbar-block">
                {navItems.map((item) => (
                    <Link className="navbar_address" to={item.route} key={item.route}>
                        {item.label}
                    </Link>
                ))}

                <LogoutApi />
                <GetSessionApi />
            </div>
        </header>
    );
};
