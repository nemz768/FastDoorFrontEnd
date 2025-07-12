import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Order} from "../../../../Interfaces/Interfaces";
import './ordersMobile.css'


interface SellerOrdersTableProps {
    isLoading: boolean;
    error: string | null;
    orders: Order[];
    openModal: (orderId: string)=> void;
    handlePageChange: (page: number) => void;
    currentPage: number;
    totalPages: number;
}


export const SellerOrdersTable:React.FC<SellerOrdersTableProps> = ({ isLoading, error, orders, openModal, handlePageChange, currentPage, totalPages }) => {
    const navigate = useNavigate();

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
                                            <button
                                                onClick={() => navigate(`/home/seller/listOrdersSeller/edit/${order.id}`)}
                                                className="edit-button"
                                            >
                                                Изменить
                                            </button>
                                            <button
                                                onClick={() => openModal(order.id)}
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

                    {orders.map(order => (
                        <div key={order.id} className="orders-mobile">
                            <div className="orders-mobile-address">
                                <h1>{order.address}</h1>
                            </div>
                            <div className="orders-mobile-info-block">
                                <div className="orders-mobile-info">
                                   <p className="orders-mobile-info-text">ФИО <strong>{order.fullName}</strong></p>
                                </div>
                                <div className="orders-mobile-info">
                                    <p className="orders-mobile-info-text">Номер <strong>{order.phone}</strong></p>
                                </div>
                                <div className="orders-mobile-info">
                                    <p className="orders-mobile-info-text">Дата <strong>{order.dateOrder}</strong></p>
                                </div>
                                <div className="orders-mobile-info">
                                    <p className="orders-mobile-info-text">Входные двери <strong>{order.frontDoorQuantity}</strong></p>
                                </div>
                                <div className="orders-mobile-info">
                                    <p className="orders-mobile-info-text">Межкомнатные двери <strong>{order.inDoorQuantity}</strong></p>
                                </div>
                                <div className="orders-mobile-info">
                                    <p className="orders-mobile-info-text">Установщик <strong>{order.installerName || "Не назначен"}</strong></p>
                                </div>
                                <div className="orders-mobile-info-last">
                                    <p className="orders-mobile-info-text">Ваш комментарий <strong>{order.messageSeller}</strong></p>
                                </div>
                            </div>
                            <div className="action-buttons-mobile">
                                <button
                                    onClick={() => navigate(`/home/seller/listOrdersSeller/edit/${order.id}`)}
                                    className="edit-button"
                                >
                                    Изменить
                                </button>
                                <button
                                    onClick={() => openModal(order.id)}
                                    className="delete-button"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}



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