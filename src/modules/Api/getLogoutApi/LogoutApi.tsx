import React from 'react'
import {useNavigate} from "react-router-dom";

export const LogoutApi = () => {
    const navigate = useNavigate();
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
        <a className="navbar_address" href="#" onClick={handleLogout}>Выйти</a>
    )
}