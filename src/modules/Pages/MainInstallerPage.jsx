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
    const [selectedTag, setSelectedTag] = useState({});
    const [comments, setComments] = useState({});
    const [postError, setPostError] = useState(null);

    const url = `/api/mainInstaller?page=${currentPage}`;
    const urlPost = `/api/mainInstaller`;

    useEffect(() => {
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
                    throw new Error(`Ошибка ${response.status}: Не удалось загрузить данные`);
                }

                const data = await response.json();
                console.log('API data:', data);

                if (!data?.orders || !data?.installers) {
                    throw new Error('Неверный формат данных от API');
                }

                setOrders(
                    data.orders.map((order) => ({
                        ...order,
                        id: String(order.id || ''),
                    })) || []
                );
                setInstallers(
                    data.installers.map((inst) => ({
                        ...inst,
                        id: String(inst.id || ''),
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

    const postData = async (orderId) => {
        setPostError(null);
        console.log('postData called with orderId:', orderId, 'orders:', orders, 'selectedTag:', selectedTag, 'comments:', comments);
        const order = orders.find((o) => o.id === orderId);

        if (!order) {
            setPostError('Заказ не найден');
            console.error('Order not found for ID:', orderId);
            return;
        }

        const installer = installers.find((inst) => inst.id === selectedTag[orderId]);
        if (!installer) {
            setPostError('Установщик не найден');
            console.error('Installer not found for ID:', selectedTag[orderId]);
            return;
        }

        const payload = {
            id: order.id,
            installerName: installer.fullName,
            messageMainInstaller: comments[orderId] || '',
        };
        console.log('Sending POST payload:', payload);

        try {
            const response = await fetch(urlPost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = `Ошибка ${response.status}: Не удалось подтвердить заказ`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                    console.log('Server error response:', errorData);
                } catch (jsonErr) {
                    console.log('Failed to parse error response:', jsonErr);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('POST response:', data);
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId
                        ? { ...o, installerName: installer.fullName, messageMainInstaller: comments[orderId] }
                        : o
                )
            );
        } catch (err) {
            console.error('Ошибка при отправке данных:', err);
            setPostError(err.message);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleChange = (event, orderId) => {
        setSelectedTag((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    const handleCommentChange = (event, orderId) => {
        setComments((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    const handleRetry = () => {
        setCurrentPage(0);
        setError(null);
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
                        <button className="retry-button" onClick={handleRetry}>
                            Повторить
                        </button>
                    </div>
                )}
                {postError && (
                    <div className="error">
                        <h3>Ошибка при подтверждении: {postError}</h3>
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
                                {orders.map((order) =>
                                    order.id ? (
                                        <tr key={order.id}>
                                            <td>{order.address || 'N/A'}</td>
                                            <td>{order.nickname || 'N/A'}</td>
                                            <td>{order.dateOrder || 'N/A'}</td>
                                            <td>{order.phone || 'N/A'}</td>
                                            <td>{order.frontDoorQuantity || 0}</td>
                                            <td>{order.inDoorQuantity || 0}</td>
                                            <td>{order.messageSeller || 'N/A'}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={comments[order.id] || ''}
                                                    onChange={(event) => handleCommentChange(event, order.id)}
                                                    placeholder="Ваш комментарий..."
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
                                                            {option.fullName || 'N/A'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    id="ConfirmBtn"
                                                    onClick={() => postData(order.id)}
                                                    disabled={!selectedTag[order.id]}
                                                >
                                                    Подтвердить
                                                </button>
                                            </td>
                                        </tr>
                                    ) : null
                                )}
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