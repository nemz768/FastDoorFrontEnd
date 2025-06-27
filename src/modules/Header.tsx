import '../styles/header.css';
import {Link, useNavigate} from 'react-router-dom';
import React, {useEffect} from "react";
import {NavItems} from "./Interfaces/Interfaces";

interface HeaderProps {
    navItems?: NavItems[];
}

export const Header = ({navItems = []}: HeaderProps) => {

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
                console.log(data)
                if (data.status === 401) {
                    navigate('/login');
                }
            }
            catch(err) {
                console.log(err)
                    navigate('/login');
            }
        }
        getSession()
    }, [])


    const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
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
            navigate('/');
        }catch (error) {
            console.log(error);
        }
    };

    return (
        <header className="header">
            <div className="navbar-block">
                {navItems.map((item) => (
                    <Link className="navbar_address" to={item.route}>
                        {item.label}
                    </Link>
                ))}
                <a className="navbar_address" href="#" onClick={handleLogout}>Выйти</a>
            </div>
        </header>
    );
};