import React from 'react';
import {Header} from "../Header.jsx";
import {Footer} from "../Footer.jsx";
import {Main} from "../Main.jsx";



const MainPage = () => {

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

export default MainPage;