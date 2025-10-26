import React, {useEffect, useState} from 'react';
import {Header} from "../../../Widgets/Header/Header";
import {Footer} from "../../../Widgets/Footer/Footer";
import {MainInstallersAllOrdersTable} from "./MainInstallerAllOrdersTable/MainInstallersAllOrdersTable";
import {Pagination} from "../../../Widgets/Pagination/Pagination";
import './mainInstallerAllOrders-page.scss'
import {Availability, OrdersResponse} from "../../../Interfaces/Interfaces";
import {installersType, InstallerWorkload} from "../MainInstallerPage/MainInstallerPage";
import {Popup} from "../../../Widgets/Popup/Popup";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store";
import {fetchOrders} from "../../../store/slices/ordersSlice";
// import {mockOrders} from "../../../mocks/orders";


interface OrderEditorTypes {
    frontDoorQuantity?: number;
    inDoorQuantity?: number;
    messageMainInstaller: string | null;
    installerName: string;
}

interface OrderResponseMainInstaller extends OrdersResponse{
    installers?: installersType[]
    availabilityList?: Availability[]
};


export const MainInstallerAllOrders = () => {
    const [orderId, setOrderId] = useState<null | string>(null);

    const [selectedTag, setSelectedTag] = useState<Record<string, string>>({});

    const [installers, setInstallers] = useState<installersType[]>([]);

   const [currentPage, setCurrentPage] = useState(0);

    const [message, sendMessage] = useState<string>('');
    const [workloadByDate, setWorkloadByDate] = useState<Record<string, InstallerWorkload[]>>({})
    const [editedOrder, setEditedOrder] = useState<OrderEditorTypes>({
        frontDoorQuantity: 0,
        inDoorQuantity: 0,
         messageMainInstaller: '',
        installerName: ''
    });

    const dispatch = useDispatch<AppDispatch>();

    const getMainInstallerDataEndpoint = `/api/mainInstaller/listOrdersMainInstaller?page=${currentPage}`;

    const query = useSelector((state: RootState) =>
        state.orders.queries[getMainInstallerDataEndpoint]
    );

    // const orders = mockOrders;
    const orders = query?.data || [];
    const loading = query?.loading || false;
    const error = query?.error;
    const totalPages = query?.totalPages || 1;


    const navItems = [
        { label: 'Главная', route: '/home/mainInstaller/'  },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
    ];

    const [highlightedRowId, setHighlightedRowId] = React.useState<string | null>(null);

    useEffect(() => {
        if (orders.length > 0) {
            const uniqueDates = [...new Set(orders.map(order => order.dateOrder))];
            const datesToFetch = uniqueDates.filter(date => date && !workloadByDate[date]);
            if (datesToFetch.length > 0) {
                Promise.all(datesToFetch.map(fetchInstallerWorkload)).catch(console.error);
            }
        }
    }, [orders, workloadByDate]);

    useEffect(() => {
        dispatch(fetchOrders({
            endpoint: `/api/mainInstaller/listOrdersMainInstaller?page=${currentPage}`,
            queryKey: getMainInstallerDataEndpoint
        }));
    }, [currentPage, dispatch]);

    const fetchInstallers = async () => {
        try {
            // Лучше использовать отдельный эндпоинт для установщиков
            const response = await fetch(`/api/mainInstaller?page=${currentPage}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data: OrderResponseMainInstaller = await response.json();

            setInstallers(
                Array.isArray(data.installers)
                    ? data.installers.map(inst => ({ ...inst, id: String(inst.id) }))
                    : []
            );
        } catch (error: any) {
            console.error('Ошибка загрузки установщиков:', error);
        }
    };
    useEffect(() => {
        fetchInstallers();
    }, []);


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


    const updateOrders = async (orderIdToUpdate:string) => {
        const order = orders.find(o => o.id === orderIdToUpdate);
        if (!order) return;


        const payload = {
            orderId: order.id,
            installerFullName: (() => {
                const selectedInstallerId = selectedTag[order.id];
                const found = installers.find(inst => inst.id === selectedInstallerId);
                return found?.fullName || order.installerName || null;
            })(),
            installerComment: editedOrder.messageMainInstaller || '',
        };

        try {
            const response = await fetch(`/api/mainInstaller`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errText = await response.text(); // посмотри, что вернёт сервер
                throw new Error(`Ошибка: ${response.status} — ${errText}`);
            }

            dispatch(fetchOrders({
                endpoint: `/api/mainInstaller/listOrdersMainInstaller?page=${currentPage}`,
                queryKey: getMainInstallerDataEndpoint
            }));


            sendMessage("Изменение прошло успешно");


            setHighlightedRowId(orderIdToUpdate);

            setTimeout(() => {
                setHighlightedRowId(null);
            }, 3000);


            setOrderId(null); // очистка выделенного заказа
            setTimeout(() => sendMessage(''), 3000);
        } catch (error: any) {
            console.error(error);
            sendMessage("Возникла ошибка: " + error.message);
        }
    };


    const deleteOrder = async (orderIdToDelete:string) => {
        try {
          const response = await fetch(`/api/delete?id=${orderIdToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });


          const data = await response.json();
            console.log(data)
            sendMessage("Удаление прошло успешно");
        } catch (error:any) {
            console.error("Ошибка удаления заказа:", error);
            sendMessage("Ошибка при удалении: " + error.message);
        }finally {
            setTimeout(()=> sendMessage(""), 3000)
        }
    };


    const reversedDate = (dateString = '') => {
        const day = dateString.slice(8, 10);
        const month = dateString.slice(5, 7);
        const year = dateString.slice(0, 4);
        if (!day || !month || !year) return '';
        return `${day}.${month}.${year}`;
    };

    const handleRetry = () => {
        dispatch(fetchOrders({
            endpoint: `/api/mainInstaller/listOrdersMainInstaller?page=${currentPage}`,
            queryKey: getMainInstallerDataEndpoint
        }));
    };
    return (
        <div className="mainInstallerAllOrders">
            <Header navItems={navItems} />

            <div className="mainInstallerAllOrders__block">
                <h2 className="mainInstallerAllOrders__title">Все заказы</h2>

                {error && (
                    <div className="mainInstallerAllOrders__error">
                        <h3>Ошибка: {error}</h3>
                        <button className="retry-button" onClick={handleRetry}>Повторить</button>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="mainInstallerAllOrders__no-orders">Заказы не найдены</div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div>
                        <MainInstallersAllOrdersTable
                            highlightedRowId={highlightedRowId}
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
                )}
            </div>

            <Footer />

            {message && (
                <div className="toast-notification">{message}</div>
            )}

            <Popup navItems={navItems} />
        </div>
    );
};
