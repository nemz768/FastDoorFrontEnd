import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Header} from "../../Header.jsx";
import {Footer} from "../../Footer.jsx";
import '../../../styles/stylePages/sellerPage.css'
import {Popup} from "../../special/Popup.jsx";

export const SellerPage = () => {

    const navItems = [
        { label: 'Создать заказ', route: '/home/seller/create' },
        {label: 'Список заказов', route: '/home/seller/listOrdersSeller' },
    ];

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
            <Header navItems={navItems} />
            <div className="sellerPage_block">
                <section className="orders">
                    <h2>Действия</h2>
                    <div className="orders_addresses">
                        <Link className="orders_address" to="./create">Создать новый заказ!</Link>
                        <Link className="orders_address" to="./listOrdersSeller">Список всех заказов</Link>
                    </div>
                </section>
                <Popup />
            </div>
            <Footer/>
        </>
    );
};
