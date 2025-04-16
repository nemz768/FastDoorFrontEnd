import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Header} from "./Header.jsx";
import {Footer} from "./Footer.jsx";
import '../styles/seller.css'

export const Seller = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getResult = async () => {
            const response = await fetch("/api/home/seller", {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                navigate("/403");
            }
            const data = await response.json();
            console.log(data.message);

        }
        getResult();

    }, [navigate])


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
