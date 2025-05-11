import React, {useState, useEffect} from 'react';
import {Header} from "../Header.jsx";
import {Footer} from "../Footer.jsx";
import "../../styles/stylePages/SellerAllOrdersPage.css"


export const SellerAllOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        const getApi = async () => {
            try {
                const response = await fetch("/api/list/sellerList", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }

                })
                if (!response.ok) {
                    throw new Error('Не удалось загрузить заказы');
                }
                const data = await response.json();
                setOrders(data);
                isLoading(false)
            }catch(err) {
                setError(err.message);
                isLoading(false)
                console.log(err)
            }
        }
        getApi()
    }, [])

    return (
        <>
            <Header/>
            <div className="SellerAllOrdersPage">
                {loading && <p>Загрузка заказов...</p>}
                {error && <p>Ошибка: {error}</p>}
                {!loading && !error && orders.length === 0 && <p>Заказы не найдены.</p>}
                {!loading && !error && orders.length > 0 && (
                    <ul>
                        {orders.map((order) => (
                            <li key={order.id}>
                                ID заказа: {order.id} - Статус: {order.status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Footer/>
        </>
    );
};
