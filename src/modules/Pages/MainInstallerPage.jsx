import React, { useEffect, useState } from 'react';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import '../../styles/stylePages/MainInstaller.scss'
import {CustomCalendar} from "../special/CustomCalendar.jsx";

export const MainInstallerPage = () => {

    const [orders, setOrders] = useState([]);
    const [installers, setInstallers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTag, setSelectedTag] = useState({});
    const [comments, setComments] = useState({});

    const url = `/api/mainInstaller?page=${currentPage}`;
    const urlPost = `/api/mainInstaller`;

    // Fetch orders and installers from the API cacaca
    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Safely set orders, default to empty array if undefined or not an array
            setOrders(
                Array.isArray(data.orders)
                    ? data.orders.map((order) => ({
                        ...order,
                        id: String(order.id),
                    }))
                    : []
            );

            // Safely set installers, default to empty array if undefined or not an array
            setInstallers(
                Array.isArray(data.installers)
                    ? data.installers.map((inst) => ({
                        ...inst,
                        id: String(inst.id),
                    }))
                    : []
            );

            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 0);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    // Handle comment input changes
    const handleCommentChange = (event, orderId) => {
        setComments((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    // Handle installer selection changes
    const handleChange = (event, orderId) => {
        setSelectedTag((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    // Submit order data to the API
    const postData = async (orderId) => {
        try {
            // Find the installer object based on the selectedTag[orderId] (installer id)
            const selectedInstaller = installers.find(
                (installer) => installer.id === selectedTag[orderId]
            );
            const installerFullName = selectedInstaller ? selectedInstaller.fullName : '';

            const response = await fetch(urlPost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    installerComment: comments[orderId] || '',
                    installerFullName: installerFullName,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to post data: ${response.status} ${response.statusText}`);
            }


            // Refresh orders after successful POST
            fetchOrders();
        } catch (err) {
            console.error('Error posting data:', err);
            setError(err.message);
        }
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };
//123
    return (
        <div>
            <Header />

            <div className="MainInstallerPage__block">
                <div className="MainInstallerPage__table-calendar-block">
                    <main className="SellerAllOrdersPage">
                        <div>
                            <h2>Панель установщика</h2>
                        </div>
                        {isLoading && <div className="loading">Загрузка...</div>}
                        {error && (
                            <div className="error">
                                <h3>Ошибка: {error}</h3>
                                <button className="retry-button" onClick={fetchOrders}>
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
                                            <th>Адрес доставки</th>
                                            <th>Филиалы</th>
                                            <th>Дата</th>
                                            <th>Номер телефона</th>
                                            <th>Количество входных дверей</th>
                                            <th>Количество межкомнатных дверей</th>
                                            <th>Комментарий продавца</th>
                                            <th>Ваш комментарий</th>
                                            <th>Установщик</th>
                                            <th>Действие</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td>{order.address}</td>
                                                <td>{order.nickname}</td>
                                                <td>{order.dateOrder}</td>
                                                <td>{order.phone}</td>
                                                <td>{order.frontDoorQuantity}</td>
                                                <td>{order.inDoorQuantity}</td>
                                                <td>{order.messageSeller}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={comments[order.id] || ''}
                                                        onChange={(event) => handleCommentChange(event, order.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        value={selectedTag[order.id] || ''}
                                                        onChange={(event) => handleChange(event, order.id)}
                                                    >
                                                        <option value="">Выбрать установщика</option>
                                                        {installers.map((option) => (
                                                            <option key={option.id} value={option.id}>
                                                                {option.fullName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => postData(order.id)}
                                                        disabled={!selectedTag[order.id]}
                                                        id="ConfirmBtn"
                                                    >
                                                        Подтвердить
                                                    </button>
                                                </td>
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
                    <div className="MainInstallerPage__calendar-dateTable-block">
                        <div>
                        <CustomCalendar/>
                        <button>Закрыть день!</button>
                    </div>
                        <div>
                            <h1>ТАБЛИЦА ДАТ</h1>

                        </div>
                    </div>
                </div>

            </div>


            <Footer />
        </div>
    );
};