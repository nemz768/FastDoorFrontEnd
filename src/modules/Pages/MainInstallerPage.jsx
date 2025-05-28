import React, { useEffect, useState } from 'react';
import { Header } from "../Header.jsx";
import { Footer } from "../Footer.jsx";
import '../../styles/stylePages/mainInstallerPage.css';

export const MainInstallerPage = () => {
    const [orders, setOrders] = useState([]);
    const [installers, setInstallers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // New state for success messages
    const [selectedTag, setSelectedTag] = useState({}); // Stores installerId
    const [comments, setComments] = useState({}); // Controlled input for comments

    const url = `/api/mainInstaller?page=${currentPage}`;
    const urlPost = `/api/mainInstaller`;

    // Fetch orders and installers
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            setSuccess(null);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to load orders or installers.');
                }
                const data = await response.json();
                console.log('API data:', data);
                setOrders(
                    data.orders?.map((order) => ({
                        ...order,
                        id: String(order.id),
                    })) || []
                );
                setInstallers(
                    data.installers?.map((inst) => ({
                        ...inst,
                        id: String(inst.id),
                    })) || []
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

        fetchOrders();
    }, [currentPage]);

    // Handle installer selection
    const handleChange = (event, orderId) => {
        setSelectedTag((prev) => ({
            ...prev,
            [orderId]: event.target.value, // Stores installer.id
        }));
    };

    // Handle comment input
    const handleCommentChange = (event, orderId) => {
        setComments((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    // Handle POST request
    const postData = async (orderId) => {
        if (!selectedTag[orderId]) {
            setError('Please select an installer before confirming.');
            setSuccess(null);
            return;
        }
        if (!comments[orderId]) {
            setError('Please enter a comment before confirming.');
            setSuccess(null);
            return;
        }

        const selectedInstaller = installers.find((inst) => inst.id === selectedTag[orderId]);

        try {
            setError(null);
            setSuccess(null);
            const response = await fetch(urlPost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    installerComment: comments[orderId] || '',
                    installerFullName: selectedInstaller ? selectedInstaller.fullName : '',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit data.');
            }

            const data = await response.json();
            console.log('POST response:', data);
            setSuccess(`Order ${orderId} successfully updated!`);
            setComments((prev) => ({ ...prev, [orderId]: '' }));
            setSelectedTag((prev) => ({ ...prev, [orderId]: '' }));

            // Optionally refetch orders to reflect changes
            const fetchOrders = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (!response.ok) throw new Error('Failed to reload orders.');
                    const data = await response.json();
                    setOrders(
                        data.orders?.map((order) => ({
                            ...order,
                            id: String(order.id),
                        })) || []
                    );
                    setTotalPages(data.totalPages || 1);
                    setCurrentPage(data.currentPage || 0);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOrders();
        } catch (err) {
            console.error('POST error:', err);
            setError(err.message);
        }
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className='admin-panel'>
            <Header />
            <main className="SellerAllOrdersPage">
                <div>
                    <h2>Панель установщика</h2>
                </div>
                {isLoading && <div className="loading">Загрузка...</div>}
                {error && (
                    <div className="error">
                        <h3>Ошибка: {error}</h3>
                        <button
                            className="retry-button"
                            onClick={() => setCurrentPage(currentPage)} // Trigger refetch
                        >
                            Повторить
                        </button>
                    </div>
                )}
                {success && (
                    <div className="success">
                        <h3>{success}</h3>
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
                                                placeholder="Enter your comment"
                                            />
                                        </td>
                                        <td>
                                            {installers.length > 0 ? (
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
                                            ) : (
                                                <span>Нет доступных установщиков</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => postData(order.id)}
                                                disabled={!selectedTag[order.id] || !comments[order.id]}
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
            <Footer />
        </div>
    );
};