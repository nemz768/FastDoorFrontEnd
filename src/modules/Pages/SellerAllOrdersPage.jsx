import React, { useState, useEffect } from 'react';
import '../../styles/stylePages/SellerAllOrdersPage.css';
import {Header} from "../Header.jsx";
import {Footer} from "../Footer.jsx";

export const SellerAllOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/list/sellerList?page=${currentPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('API data:', data);
                setOrders(data.orders || []);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage]);

    console.log('Orders state:', orders); // Log current orders state

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="SellerAllOrdersPage">
            <Header />
            <h2>Seller Orders</h2>
            {isLoading && <div>Loading...</div>}
            {error && <div className="error">Error: {error}</div>}
            {!isLoading && !error && orders.length === 0 && <div>No orders found</div>}
            {!isLoading && !error && orders.length > 0 && (
                <>
                    <table border="1" className="orders-table">
                        <thead>
                        <tr>
                            <th>ФИО</th>
                            <th>Адрес доставки</th>
                            <th>Номер</th>
                            <th>Дата</th>
                            <th>Количество входных дверей</th>
                            <th>Количество межкомнатных дверей</th>
                            <th>Ваш комментарий</th>
                            <th>Установщик</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.fullName}</td>
                                <td>{order.address}</td>
                                <td>{order.phone}</td>
                                <td>{order.dateOrder}</td>
                                <td>{order.frontDoorQuantity}</td>
                                <td>{order.inDoorQuantity}</td>
                                <td>{order.messageSeller}</td>
                                <td>{order.mainInstaller}</td>
                                <td>
                                    <div>
                                        <button>Изменить</button>
                                        <button>Удалить</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            Предыдущая
                        </button>
                        <span>
                            Страница {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                        >
                            Следующая
                        </button>
                    </div>
                </>
            )}
            <Footer/>
        </div>
    );
};