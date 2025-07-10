import React, {useEffect, useState} from 'react';
import {Header} from "../../../Widgets/Header/Header";
import {Footer} from "../../../Widgets/Footer/Footer";
import {MainInstallersAllOrdersTable} from "./MainInstallerAllOrdersTable/MainInstallersAllOrdersTable";
import {Pagination} from "../../../Widgets/Pagination/Pagination";
import './mainInstallerAllOrders.css'
import {Availability, Order, OrdersResponse} from "../../../Interfaces/Interfaces";
import {installersType, InstallerWorkload} from "../MainInstallerPage/MainInstallerPage";


interface OrderEditorTypes {
    frontDoorQuantity: number;
    inDoorQuantity: number;
    messageMainInstaller: string | null;
    installerName: string;
}

interface OrderResponseAllOrders extends OrdersResponse {
    installers?: installersType[]
    availabilityList?: Availability[]

}


export const MainInstallerAllOrders = () => {
    const [orderId, setOrderId] = useState<null | string>(null);
    const [selectedTag, setSelectedTag] = useState<Record<string, string>>({});
    const [loading, isLoading] = useState(false);
    const [installers, setInstallers] = useState<installersType[]>([]);
    const [error, setError] = useState<null | string>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [message, sendMessage] = useState<string>('');
    const [workloadByDate, setWorkloadByDate] = useState<Record<string, InstallerWorkload[]>>({})
    const [editedOrder, setEditedOrder] = useState<OrderEditorTypes>({
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
                const data: OrderResponseAllOrders = await response.json();

                setOrders(
                    data.orders.map((order) => ({
                        ...order,
                        id: order.id,
                    })) || []
                );
                setInstallers(
                    Array.isArray(data.installers)
                        ? data.installers.map((inst) => ({
                            ...inst,
                            id: String(inst.id),
                        }))
                        : []
                );
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
                isLoading(false);
                const uniqueDates = [...new Set(data.orders.map((order) => order.dateOrder))];
                await Promise.all(uniqueDates.map((date) => fetchInstallerWorkload(date)));
            }
    catch (error: any) {
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


    const updateOrders = async (orderIdToUpdate:string) => {
        const order = orders.find(o => o.id === orderIdToUpdate);
        if (!order) return;


        const frontDoorQuantity = Number(editedOrder.frontDoorQuantity);
        const inDoorQuantity = Number(editedOrder.inDoorQuantity);

        const payload = {
            id: order.id,
            fullName: order.fullName || '',
            address: order.address || '',
            phone: order.phone || '',
            dateOrder: order.dateOrder || '',
            frontDoorQuantity: frontDoorQuantity,
            inDoorQuantity: inDoorQuantity,
            installerName: selectedTag[order.id] || order.installerName || null,
            messageSeller: order.messageSeller || '',
            messageMainInstaller: editedOrder.messageMainInstaller || '',
            nickname: order.nickname || '',
        };

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

            sendMessage("Успешно");
            setOrderId(null); // очистка выделенного заказа
            setTimeout(() => sendMessage(''), 3000);
        } catch (error: any) {
            console.error(error);
            sendMessage("Возникла ошибка: " + error.message);
        }
    };

    const handleDeleteSuccess = (deletedInstallerId:string) => {
        setOrders(orders.filter((order) => order.id !== deletedInstallerId));
    };


    const deleteOrder = async (orderIdToDelete:string) => {
        setError(null);
        try {
          const response = await fetch(`/api/delete?id=${orderIdToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });


          const data = await response.json();
            console.log(data)
            handleDeleteSuccess(orderIdToDelete);
            sendMessage("Удаление прошло успешно");
        } catch (error:any) {
            console.error("Ошибка удаления заказа:", error);
            setError(error.message);
            sendMessage("Ошибка при удалении: " + error.message);
        }finally {
            setTimeout(()=> sendMessage(""), 3000)
        }
    };

    const fetchInstallerWorkload = async (date: string) => {
        if (workloadByDate[date]) return;
        try {
            const response = await fetch(`/api/listInstallers/workload?date=${encodeURIComponent(date)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Не удалось загрузить данные о рабочей нагрузке: ${response.status} ${response.statusText}`);
            }

            const data: InstallerWorkload[] = await response.json();

            setWorkloadByDate((prev) => ({
                ...prev,
                [date]: data,
            }));
        } catch (err: any) {
            console.error('Ошибка при загрузке рабочей нагрузки:', err);
        }
    };

    const navItems = [
        { label: 'Главная', route: '/home/mainInstaller/'  },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
    ];

    const reversedDate = (dateString = '') => {
        const day = dateString.slice(8, 10);
        const month = dateString.slice(5, 7);
        const year = dateString.slice(0, 4);
        if (!day || !month || !year) return '';
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
                            deleteOrder={deleteOrder}
                            workloadByDate={workloadByDate}
                            installers={installers}
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
