import React from 'react';
import {Header} from "../../Widgets/Header/Header";
import {Footer} from "../../Widgets/Footer/Footer";
import {Main} from "../../Widgets/Main/Main";



export const MainPage = () => {

    const navItems = [
        { label: 'Войти', route: '/login' },
        { label: 'Регистрация', route: '/home/mainInstaller/create' },
        { label: 'Список заказов', route: '/404' },
    ];

    return (
     <div>
         <Header navItems={navItems} />
         <Main />
         <Footer />
     </div>
    );
};
