import React from 'react';
import { useNavigate } from "react-router-dom";

export const LogoutApi = () => {
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        try {
            await fetch("/api/logout", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.warn("Ошибка при выходе:", error);
        }

        localStorage.removeItem('userRoles');
        navigate('/login');
    };

    return (
        <a className="navbar_address" href="#" onClick={handleLogout}>
            Выйти
        </a>
    );
};
