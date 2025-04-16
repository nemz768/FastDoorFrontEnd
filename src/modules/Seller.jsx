import React, {useEffect} from 'react';
import {Header} from "./Header.jsx";
import {Footer} from "./Footer.jsx";
import '../styles/seller.css'

export const Seller = () => {


    useEffect(() => {
        fetch("/api/orders/create", {
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => res.text())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    }, [])

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
