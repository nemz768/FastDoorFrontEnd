import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Header} from "../../../Widgets/Header/Header";
import {Footer} from "../../../Widgets/Footer/Footer";
import './sellerPage.css'
import {Popup} from "../../../Widgets/Popup/Popup";

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
                        <button className="orders_address" onClick={()=> navigate("./create")}>Создать новый заказ</button>
                        <button className="orders_address" onClick={()=> navigate("./listOrdersSeller")}>Список всех заказов</button>
                    </div>
                </section>
            </div>
            <Footer/>
            <Popup navItems={navItems}/>
        </>
    );
};
