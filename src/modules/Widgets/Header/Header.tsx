import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { NavItems } from "../../Interfaces/Interfaces";
import { LogoutApi } from "../../Api/getLogoutApi/LogoutApi";

interface HeaderProps {
    navItems?: NavItems[];
}

export const Header = ({ navItems = [] }: HeaderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getSession = async () => {
            try {
                const response = await fetch('/api/check-session', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                const data = await response.json();
                console.log(data);

                if (data.status === 401) {
                    setIsLoggedIn(false);
                    navigate('/login');
                } else {
                    setIsLoggedIn(true);
                }
            } catch (err) {
                console.log(err);
                setIsLoggedIn(false);
                navigate('/login');
            }
        };

        getSession();
    }, [navigate]);

    return (
        <header className="header">
            <div className="navbar-block">
                {navItems.map((item) => (
                    <Link className="navbar_address" to={item.route} key={item.route}>
                        {item.label}
                    </Link>
                ))}
                {!isLoggedIn && <LogoutApi />}
            </div>
        </header>
    );
};
