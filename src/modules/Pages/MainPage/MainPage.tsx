import React, {useEffect} from 'react';
import {Header} from "../../Widgets/Header/Header";
import {Footer} from "../../Widgets/Footer/Footer";
import {Main} from "../../Widgets/Main/Main";
import {Popup} from "../../Widgets/Popup/Popup";
import {useNavigate} from "react-router-dom";


export const MainPage = () => {
    const navigate = useNavigate();

    const navItems = [
        { label: 'Войти', route: '/login' },
        { label: 'Регистрация', route: '/home/mainInstaller/create' },

    ];

    useEffect(() => {
        navigate('/login');
    }, [navigate]);

    return (
     <div>
         <Header navItems={navItems} />
         <Main />
         <Footer />
         <Popup navItems={navItems}/>
     </div>
    );
};
