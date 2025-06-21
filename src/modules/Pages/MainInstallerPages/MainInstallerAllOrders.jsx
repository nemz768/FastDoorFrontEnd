import React, {useEffect, useState} from 'react';
import {Header} from "../../Header.jsx";
import {Footer} from "../../Footer.jsx";
import {MainInstallersAllOrdersTable} from "./MainInstallersAllOrdersTable.jsx";
import {Pagination} from "../../special/Pagination.jsx";
import '../../../styles/styleMainInstaller/mainInstallerAllOrders.css'

export const MainInstallerAllOrders = () => {
    const [loading, isLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [message, sendMessage] = useState('');

    const fetchOrders = async () => {
            isLoading(true);
            try {
                const response = await fetch(`/api/mainInstaller/listOrdersMainInstaller?page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                const data = await response.json();

                setOrders(
                    data.orders.map((order) => ({
                        ...order,
                        id: String(order.id),
                    })) || []
                );
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
                isLoading(false);
            }
            catch (error) {
                console.error('Ошибка загрузки заказов:', error);
                setError(error.message);
            }

            finally {
                isLoading(false);
            }
        }

    useEffect(() => {
        fetchOrders();
    }, [currentPage])

    const payload = {
        address: orders.address,
        nickname: orders.nickname,
        dateOrder: orders.dateOrder,
        phone: orders.phone,
        frontDoorQuantity: orders.frontDoorQuantity,
        messageSeller: orders.messageSeller,
        messageMainInstaller: orders.messageMainInstaller,
        installerName: orders.installerName,
    }

    const updateOrders = async (order) => {
        try {
            const response = await fetch(`/api/edit/${order.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json();
            console.log(data);
            sendMessage("Success")
        }
        catch (error) {
            console.log(error);
        }
    }

    const navItems = [
        { label: 'Главная', route: '/home/mainInstaller/'  },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
    ];

    const reversedDate = (dateString) => {
        const day = dateString.slice(8);
        const month = dateString.slice(5, 7);
        const year = dateString.slice(0, 4);
        return `${day}.${month}.${year}`;
    };

    return (
        <div className="mainInstallerAllOrders">
            <Header navItems={navItems}/>

            <div className="mainInstallerAllOrders-block">
                <h2 className="mainInstallerAllOrders-title">Все заказы</h2>

                {error && (
                    <div className="error">
                        <h3>Ошибка: {error}</h3>
                        <button className="retry-button" onClick={fetchOrders}>
                            Повторить
                        </button>
                    </div>
                )}
                {!loading && !error && orders.length === 0 && (
                    <div className="no-orders">Заказы не найдены</div>
                )}
                {!loading && !error && orders.length > 0 &&
                    <div>
                        <MainInstallersAllOrdersTable
                            orders={orders}
                            reversedDate={reversedDate}
                            updateOrders={updateOrders}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                }
            </div>
            <Footer/>
            {message && (
                <div className="toast-notification">
                    {message}
                </div>
            )}
        </div>
    );
};
