import React, {useEffect, useState} from 'react';
import {Header} from "../../Header.jsx";
import {Footer} from "../../Footer.jsx";
import {MainInstallersAllOrdersTable} from "./MainInstallersAllOrdersTable.jsx";
import {Pagination} from "../../special/Pagination.jsx";
import '../../../styles/styleMainInstaller/mainInstallerAllOrders.css'

export const MainInstallerAllOrders = () => {
    const [orderId, setOrderId] = useState(null);
    const [selectedTag, setSelectedTag] = useState({});
    const [loading, isLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [message, sendMessage] = useState('');
    const [editedOrder, setEditedOrder] = useState({
        frontDoorQuantity: 0,
        inDoorQuantity: 0,
         messageMainInstaller: '',
        installerName: ''
    });
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
                        id: order.id,
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


    const updateOrders = async (orderIdToUpdate) => {
        const order = orders.find(o => o.id === orderIdToUpdate);
        if (!order) return;

        const numericId = Number(order.id);
        const frontDoorQuantity = Number(editedOrder.frontDoorQuantity);
        const inDoorQuantity = Number(editedOrder.inDoorQuantity);

        const payload = {
            id: numericId,
            fullName: order.fullName || '',
            address: order.address || '',
            phone: order.phone || '',
            dateOrder: order.dateOrder || '',
            frontDoorQuantity: isNaN(frontDoorQuantity) ? 0 : frontDoorQuantity,
            inDoorQuantity: isNaN(inDoorQuantity) ? 0 : inDoorQuantity,
            installerName: selectedTag[numericId] || order.installerName || null,
            messageSeller: order.messageSeller || '',
            messageMainInstaller: editedOrder.messageMainInstaller || '',
            nickname: order.nickname || '',
        };

        console.log('Payload being sent:', payload); // 👈 Можно удалить после отладки

        try {
            const response = await fetch(`/api/edit/${orderIdToUpdate}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errText = await response.text(); // посмотри, что вернёт сервер
                throw new Error(`Ошибка: ${response.status} — ${errText}`);
            }

            // Обновление в списке заказов
            setOrders(prev =>
                prev.map(item =>
                    item.id === orderIdToUpdate
                        ? { ...item, ...payload }
                        : item
                )
            );

            sendMessage("Успешный успех");
            setOrderId(null); // очистка выделенного заказа
            setTimeout(() => sendMessage(''), 3000);
        } catch (error) {
            console.error(error);
            sendMessage("Возникла ошибка: " + error.message);
        }
    };



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
                            editedOrder={editedOrder}
                            setEditedOrder={setEditedOrder}
                            setOrderId={setOrderId}
                            orderId={orderId}
                            setSelectedTag={setSelectedTag}
                            selectedTag={selectedTag}

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
