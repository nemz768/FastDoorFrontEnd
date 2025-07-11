import React from 'react';
import {Header} from "../../Widgets/Header/Header";
import {Footer} from "../../Widgets/Footer/Footer";
import {Main} from "../../Widgets/Main/Main";
import {Popup} from "../../Widgets/Popup/Popup";



export const MainPage = () => {

    const navItems = [
        { label: 'Войти', route: '/login' },
        { label: 'Регистрация', route: '/home/mainInstaller/create' },

    ];

    return (
     <div>
         <Header navItems={navItems} />
         <Main />
         <Footer />
         <Popup navItems={navItems}/>
     </div>
    );
};
