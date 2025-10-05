import React, { useState, useEffect } from 'react';
import { Header } from '../../Widgets/Header/Header';
import { Footer } from '../../Widgets/Footer/Footer';
import './admin-panel-page.scss';
import { Order, OrdersResponse } from '../../Interfaces/Interfaces';
import {Popup} from "../../Widgets/Popup/Popup";
import {Pagination} from "../../Widgets/Pagination/Pagination";



export const AdminPanelPage = () => {

    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nickName, setNickName] = useState('');
    const [showButtonClear, setShowButtonClear] = useState(false);

    const urls = nickName
        ? `/api/list/sort?nickname=${nickName}&page=${currentPage}`
        : `/api/list/adminList?page=${currentPage}`;

    const navItems = [
        { label: 'Создать отчет', route: '/home/owner/report' },
    ];

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
                    throw new Error(`Не удалось загрузить заказы либо филиала ${nickName} не существует!`);
                }
                const data: OrdersResponse = await response.json();

                const normalizedOrders: Order[] = data.orders.map((order) => ({
                    ...order,
                    id: String(order.id),
                }));

                setOrders(
                    normalizedOrders
                );
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
            } catch (err: any) {
                console.error('Ошибка загрузки заказов:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage, nickName]);

    const handleSearch = (value: string) => {
        setShowButtonClear(value !== '');
        setNickName(value);
        setCurrentPage(0);
    }

    const handleClearSearch = () => {
        setShowButtonClear(false);
        setNickName('');
        setCurrentPage(0);
    }


    const reversedDate = (dateString = '') => {
        const day = dateString.slice(8, 10);
        const month = dateString.slice(5, 7);
        const year = dateString.slice(0, 4);
        if (!day || !month || !year) return '';
        return `${day}.${month}.${year}`;
    };



    return (
        <div className="admin-panel">
            <Header navItems={navItems} />
            <main className="SellerAllOrdersPage">
                <div>
                    <h2>Панель администратора</h2>
                    <div className="InputBlock">
                        <input
                            className="inputFind bg-white"
                            onChange={(e)=> handleSearch(e.target.value)}
                            type="search"
                            value={nickName}
                            placeholder="Поиск по филиалу..."
                        />
                        {showButtonClear && (
                            <button id="CleanButton" onClick={handleClearSearch} className='cleanInputSvg'>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="17" height="17" viewBox="0 0 50 50">
                                    <path d="M 40.783203 7.2714844 A 2.0002 2.0002 0 0 0 39.386719 7.8867188 L 25.050781 22.222656 L 10.714844 7.8867188 A 2.0002 2.0002 0 0 0 9.2792969 7.2792969 A 2.0002 2.0002 0 0 0 7.8867188 10.714844 L 22.222656 25.050781 L 7.8867188 39.386719 A 2.0002 2.0002 0 1 0 10.714844 42.214844 L 25.050781 27.878906 L 39.386719 42.214844 A 2.0002 2.0002 0 1 0 42.214844 39.386719 L 27.878906 25.050781 L 42.214844 10.714844 A 2.0002 2.0002 0 0 0 40.783203 7.2714844 z"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                {isLoading && <div className="loading">Загрузка...</div>}
                {error && (
                    <div className="error">
                        <h3>Ошибка: {error}</h3>
                        <button onClick={handleClearSearch} className="retry-button">
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
                    </>
                )}

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

                <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>

            </main>

            <Footer />
            <Popup navItems={navItems}/>
        </div>
    );
};