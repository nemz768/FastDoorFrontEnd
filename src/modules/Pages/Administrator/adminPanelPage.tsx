import React, { useState, useEffect } from 'react';
import { Header } from '../../Widgets/Header/Header';
import { Footer } from '../../Widgets/Footer/Footer';
import './admin-panel-page.scss';
import { Popup } from "../../Widgets/Popup/Popup";
import { Pagination } from "../../Widgets/Pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import { fetchOrders } from '../../store/slices/ordersSlice';
// import {mockOrders} from "../../mocks/orders";


export const AdminPanelPage = () => {
    const [nickName, setNickName] = useState('');
    const [showButtonClear, setShowButtonClear] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);



    const endpoint = nickName
        ? `/api/list/sort?nickname=${nickName}&page=${currentPage}`
        : `/api/list/adminList?page=${currentPage}`;

    const dispatch = useDispatch<AppDispatch>();
    const query = useSelector((state: RootState) => state.orders.queries[endpoint]);

    const navItems = [
        { label: 'Создать отчет', route: '/home/owner/report' },
    ];

    useEffect(() => {
        dispatch(fetchOrders({ endpoint, queryKey: endpoint }));
    }, [endpoint, dispatch]);

    const handleSearch = (value: string) => {
        setShowButtonClear(value !== '');
        setNickName(value);
        setCurrentPage(0);
    };

    const handleClearSearch = () => {
        setShowButtonClear(false);
        setNickName('');
        setCurrentPage(0);
    };

    const reversedDate = (dateString = '') => {
        const day = dateString.slice(8, 10);
        const month = dateString.slice(5, 7);
        const year = dateString.slice(0, 4);
        if (!day || !month || !year) return '';
        return `${day}.${month}.${year}`;
    };


    // const orders = mockOrders;
    const orders = query?.data || [];
    const totalPages = query?.totalPages || 1;
    const isLoading = query?.loading || false;
    const error = query?.error || null;

    return (
        <div className="admin-panel">
            <Header navItems={navItems} />
            <main className="SellerAllOrdersPage">
                <div>
                    <h2>Панель администратора</h2>
                    <div className="InputBlock">
                        <input
                            className="inputFind bg-white"
                            onChange={(e) => handleSearch(e.target.value)}
                            type="search"
                            value={nickName}
                            placeholder="Поиск по филиалу..."
                        />
                        {showButtonClear && (
                            <button id="CleanButton" onClick={handleClearSearch} className='cleanInputSvg'>
                                <svg>...</svg>
                            </button>
                        )}
                    </div>
                </div>

                {isLoading && <div className="loading">Загрузка...</div>}
                {error && (
                    <div className="error">
                        <h3>Ошибка: {error}</h3>
                        <button onClick={() => dispatch(fetchOrders({ endpoint, queryKey: endpoint }))} className="retry-button">
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
                                    <th>Дата установки</th>
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
                                        <td>{reversedDate(order.dateOrder)}</td>
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

                        {/* Мобильная версия */}
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
                                        Дата <strong>{reversedDate(order.dateOrder)}</strong>
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
                            </div>
                        ))}
                    </>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </main>
            <Footer />
            <Popup navItems={navItems} />
        </div>
    );
};