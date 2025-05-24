import React, { useState, useEffect } from 'react';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import '../../styles/stylePages/adminPanelPage.css';


export const AdminPanelPage = () => {
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
                const response = await fetch(`/api/list/adminList?page=${currentPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Не удалось загрузить заказы: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('API data:', data);
                setOrders(
                    data.orders.map((order) => ({
                        ...order,
                        id: String(order.id),
                    })) || []
                );
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
            } catch (err) {
                console.error('Ошибка загрузки заказов:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="admin-panel">
            <Header />
            <main className="SellerAllOrdersPage">
                <h2>Панель администратора</h2>
                {isLoading && <div className="loading">Загрузка...</div>}
                {error && (
                    <div className="error">
                        Ошибка: {error}
                        <button onClick={() => setCurrentPage(currentPage)} className="retry-button">
                            Повторить
                        </button>
                    </div>
                )}
                {!isLoading && !error && orders.length === 0 && (
                    <div className="no-orders">Заказы не найдены</div>
                )}
                {!isLoading && !error && orders.length > 0 && (
                    <>
                        <div className="table-container">
                            <table className="orders-table">
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
                                    <th>Филиалы</th>
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
                                        <td>{order.installerName || 'Не назначен'}</td>
                                        <td>{order.nickname}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="pagination-button"
                            >
                                Предыдущая
                            </button>
                            <span className="pagination-info">
                Страница {currentPage + 1} из {totalPages}
              </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="pagination-button"
                            >
                                Следующая
                            </button>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};