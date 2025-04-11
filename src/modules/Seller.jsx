import React from 'react';
import {Header} from "./Header.jsx";
import {Footer} from "./Footer.jsx";
import '../styles/seller.css'

export const Seller = () => {
    return (
        <>
            <Header />
            <div>
                <section className="orders">
                    <h2>Действия</h2>
                    <button><a>Создать новый заказ</a></button>
                </section>
            </div>
            <Footer/>
        </>
    );
};
