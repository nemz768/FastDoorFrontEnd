import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Header} from "../Header.jsx";
import {Footer} from "../Footer.jsx";
import '../../styles/stylePages/sellerPage.css'

export const SellerPage = () => {
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
                    <button onClick={()=> navigate('./create')}>Создать новый заказ</button>
                </section>
            </div>
            <Footer/>
        </>
    );
};
