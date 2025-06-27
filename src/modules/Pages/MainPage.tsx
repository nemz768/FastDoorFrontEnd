import React from 'react';
import {Header} from "../Header.tsx";
import {Footer} from "../Footer.tsx";
import {Main} from "../Main.tsx";



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