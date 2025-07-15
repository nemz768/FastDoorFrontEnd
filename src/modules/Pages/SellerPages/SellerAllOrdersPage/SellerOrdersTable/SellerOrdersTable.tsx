import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Order} from "../../../../Interfaces/Interfaces";
import './ordersMobile.css'
import {Pagination} from "../../../../Widgets/Pagination/Pagination";


interface SellerOrdersTableProps {
    isLoading: boolean;
    error: string | null;
    orders: Order[];
    openModal: (orderId: string)=> void;
    handlePageChange: (page: number) => void;
    currentPage: number;
    totalPages: number;
    setCurrentPage: (currentPage: number) => void;
}


export const SellerOrdersTable:React.FC<SellerOrdersTableProps> = ({ isLoading, error, orders, openModal,  currentPage, totalPages, setCurrentPage }) => {
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
                                <th>Дата установки</th>
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
                                  ФИО <strong>{order.fullName}</strong>
                                </div>
                                <div className="orders-mobile-info">
                                  Номер <strong>{order.phone}</strong>
                                </div>
                                <div className="orders-mobile-info">
                                   Дата <strong>{order.dateOrder}</strong>
                                </div>
                                <div className="orders-mobile-info">
                                    Входные двери <strong>{order.frontDoorQuantity}</strong>
                                </div>
                                <div className="orders-mobile-info">
                                   Межкомнатные двери <strong>{order.inDoorQuantity}</strong>
                                </div>
                                <div className="orders-mobile-info">
                                   Установщик <strong>{order.installerName || "Не назначен"}</strong>
                                </div>
                                <div className="orders-mobile-info-last">
                                 Ваш комментарий <strong>{order.messageSeller || "Нет"}</strong>
                                </div>
                            </div>
                            <div className="action-buttons-mobile">
                                <button
                                    onClick={() => navigate(`/home/seller/listOrdersSeller/edit/${order.id}`)}
                                    className="edit-button buttonAction"
                                >
                                    Изменить
                                </button>
                                <button
                                    onClick={() => openModal(order.id)}
                                    className="delete-button buttonAction"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </>
            )}
        </main>
    );
};