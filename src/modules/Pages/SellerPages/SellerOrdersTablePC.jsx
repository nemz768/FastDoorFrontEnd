import React from 'react';
import {useNavigate} from 'react-router-dom';

export const SellerOrdersTablePc = ({isLoading, error, orders, openModal, handlePageChange, currentPage, totalPages}) => {
  const navigate = useNavigate(null);


    return (
        <main className="SellerAllOrdersPage">
            <h2>Заказы продавца</h2>
            {isLoading && <div className="loading">Загрузка...</div>}
            {error && <div className="error">Ошибка: {error}</div>}
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
                                    <td>{order.installerName || 'Не назначен'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={()=> navigate(`./edit/:orderId`)} className="edit-button">Изменить</button>
                                            <button
                                                onClick={() => openModal(order.id)} // Исправлено
                                                className="delete-button"
                                            >
                                                Удалить
                                            </button>
                                        </div>
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
    );
};
