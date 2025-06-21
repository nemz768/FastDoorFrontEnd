import React from 'react';
import {Header} from "../../Header.jsx";
import {Footer} from "../../Footer.jsx";

export const MainInstallerAllOrders = () => {
    const navItems = [
        { label: 'Главная продавца', route: '/home/seller' },
        { label: 'Создать заказ', route: '/home/seller/create' },
    ];
    return (
        <div>
            <Header navItems={navItems}/>

            <div>
                sbo132
            </div>

            <Footer/>
        </div>
    );
};
