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
    const [nickName, setNickName] = useState('');

    const urls = nickName
        ? `/api/list/sort?nickname=${nickName}&page=${currentPage}`
        : `/api/list/adminList?page=${currentPage}`;



    useEffect(() => {



        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(urls, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Не удалось загрузить заказы либо не существует!`);
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
    }, [currentPage, nickName]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearch = (e) => {
        setNickName(e.target.value);
        setCurrentPage(0);
    }

    const handleError = () => {
        setNickName('');
        setCurrentPage(currentPage);
    }

    const cleanBtn = document.querySelector('#cleanBtn');

    if (!nickName === '') {
        cleanBtn.style.display = 'flex';
    }else {
        cleanBtn.style.display = 'none';
    }

    return (
        <div className="admin-panel">
            <Header />
            <main className="SellerAllOrdersPage">
                <div>
                    <h2>Панель администратора</h2>
                    <div className="InputBlock">
                        <input
                            onChange={handleSearch}
                            type="search"
                            value={nickName}
                            placeholder="Поиск по филиалу..."
                        />
                        <button id="CleanButton" onClick={handleError} className='cleanInputSvg'>
                            <svg className="crestSvg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                                <path d="M 40.783203 7.2714844 A 2.0002 2.0002 0 0 0 39.386719 7.8867188 L 25.050781 22.222656 L 10.714844 7.8867188 A 2.0002 2.0002 0 0 0 9.2792969 7.2792969 A 2.0002 2.0002 0 0 0 7.8867188 10.714844 L 22.222656 25.050781 L 7.8867188 39.386719 A 2.0002 2.0002 0 1 0 10.714844 42.214844 L 25.050781 27.878906 L 39.386719 42.214844 A 2.0002 2.0002 0 1 0 42.214844 39.386719 L 27.878906 25.050781 L 42.214844 10.714844 A 2.0002 2.0002 0 0 0 40.783203 7.2714844 z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                {isLoading && <div className="loading">Загрузка...</div>}
                {error && (
                    <div className="error">
                        <h3>Ошибка: {error}</h3>
                        <button onClick={handleError} className="retry-button">
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