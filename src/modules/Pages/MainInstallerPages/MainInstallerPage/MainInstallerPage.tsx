import React, { useEffect, useState } from 'react';
import { Header } from '../../../Widgets/Header/Header';
import { Footer } from '../../../Widgets/Footer/Footer';
import { CustomCalendar } from '../../../Widgets/CustomCalendar/CustomCalendar';
import './mainInstaller-page.scss'
import openSvg from '../../../../../public/unlock-alt-svgrepo-com.svg'
import changeDataSvg from '../../../../../public/change-management-backup-svgrepo-com.svg'
import shutdownSvg from '../../../../../public/lock-alt-svgrepo-com.svg'
import {ChangeDoorsLimit} from "../../../Widgets/ChangeDoorLimits/ChangeDoorsLimit";
import {Pagination} from "../../../Widgets/Pagination/Pagination";
import {MainInstallerTable} from "./MainInstallerTable/MainInstallerTable";
import {Order, OrdersResponse, Availability} from "../../../Interfaces/Interfaces";
import {Popup} from "../../../Widgets/Popup/Popup";

export interface installersType {
    id: string;
    fullName: string;
}

export interface InstallerWorkload {
    orderId: number;
    installerFullName: string;
    installerComment: string;
    frontDoorQuantity: number;
    inDoorQuantity: number;
}

interface OrderResponseMainInstaller extends OrdersResponse{
    installers?: installersType[]
    availabilityList?: Availability[]
};

export const MainInstallerPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [installers, setInstallers] = useState<installersType[]>([]);
    const [fetchedAvailability, setFetchedAvailability] = useState<Availability[]>([]);
    const [availabilityList, setAvailabilityList] = useState<Availability[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<Record<string, string>>({});
    const [comments, setComments] = useState<Record<string, string>>({});
    const [currentAvailabilityPage, setCurrentAvailabilityPage] = useState(0);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [workloadByDate, setWorkloadByDate] = useState<Record<string, InstallerWorkload[]>>({});
   const recordsPerPage = 10;
    const [isOrdersLoading, setIsOrdersLoading] = useState(false);
    const [isAvailabilityChanging, setIsAvailabilityChanging] = useState(false);
    const [closedSelectedDates, setClosedSelectedDates] = useState<Set<string>>(new Set());
    const [openCalendarDateChange, setOpenCalendarDateChange] = useState(false);
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

    const url = `/api/mainInstaller?page=${currentPage}`;
    const urlPost = `/api/mainInstaller`;

    const navItems = [
        { label: 'Список установщиков', route: '/home/mainInstaller/InstallersList' },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
        { label: 'Полный список заказов', route: '/home/mainInstaller/listOrdersMainInstaller' },
    ];

    const selectedAvailability = availabilityList.find(
        (item) => item.date === selectedDate
    );


    const fetchInstallerWorkload = async (date: string) => {
        if (workloadByDate[date]) return; // Пропускаем, если данные уже загружены
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


    useEffect(() => {
        if (selectedDate) {
            fetchInstallerWorkload(selectedDate);
        }
    }, [selectedDate]);


    // Форматирование даты в DD.MM.YYYY
    const reversedDate = (dateString: string) => {
        if (dateString.length < 10) return '';
        const day = dateString.slice(8, 10);
        const month = dateString.slice(5, 7);
        const year = dateString.slice(0, 4);
        if (!day || !month || !year) return '';
        return `${day}.${month}.${year}`;
    };


    // Получение данных о заказах и доступности
    const fetchOrders = async () => {
        setIsOrdersLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Не удалось загрузить заказы: ${response.status} ${response.statusText}`);
            }

            const data: OrderResponseMainInstaller = await response.json();

            setOrders(
                Array.isArray(data.orders)
                    ? data.orders.map((order) => ({
                        ...order,
                        id: String(order.id),
                    }))
                    : []
            );

            setAvailabilityList(
                Array.isArray(data.availabilityList)
                    ? data.availabilityList.map((list) => ({
                        ...list,
                        formattedDate: reversedDate(list.date),
                    }))
                    : []
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

            // Запрашиваем нагрузку для уникальных дат заказов
            const uniqueDates = [...new Set(data.orders.map((order) => order.dateOrder))];
            await Promise.all(uniqueDates.map((date) => fetchInstallerWorkload(date)));
        } catch (err: any) {
            console.error('Ошибка при загрузке заказов:', err);
            setError(err.message);
        } finally {
            setIsOrdersLoading(false);
        }
    };
    useEffect(() => {
        const showCountOfDoors = async () => {
            try {
                const res = await fetch("/api/orders/create", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                const availabilityData = Array.isArray(data.availabilityList) ? data.availabilityList : [];
                setFetchedAvailability(availabilityData);
                console.log("Загруженные данные о доступности:", availabilityData);
            } catch (err) {
                console.error("Ошибка при загрузке доступности:", err);
                setFetchedAvailability(availabilityList || []);
            }
        };
        showCountOfDoors();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const closeDateCalendar = async () => {
        if (selectedDates.size === 0) {
            console.warn("Даты не выбраны!");
            return;
        }

        const updatedDates: string[] = [];

        try {
            setIsAvailabilityChanging(true);
            for (const date of selectedDates) {
                const response = await fetch(`/api/doorLimits/closeDate?date=${encodeURIComponent(date)}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        date: date,
                        available: false,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Ошибка при закрытии даты: ${date} ${response.status} ${response.statusText}`);
                }
                updatedDates.push(date);
            }

            setFetchedAvailability(prev =>
                prev.map(item =>
                    updatedDates.includes(item.date) ? { ...item, available: false } : item
                )
            );

            setAvailabilityList(prev =>
                prev.map(item =>
                    updatedDates.includes(item.date) ? { ...item, available: false } : item
                )
            );

            setSelectedDate(null);
            setSelectedDates(new Set()); // сброс выделения после закрытия
        } catch (err:any) {
            console.error("Ошибка при закрытии даты:", err);
            setError(err.message);
        } finally {
            setIsAvailabilityChanging(false);
        }
    };

    const openDates = async () => {
        if (closedSelectedDates.size === 0) {
            alert("Выберите закрытые дни для открытия");
            return;
        }
        setIsAvailabilityChanging(true);
        setError(null);
        const updatedDates: string[] = [];

        try {
            for (const date of closedSelectedDates) {
                const response = await fetch(`/api/doorLimits/openDate?date=${encodeURIComponent(date)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ date: date, available: true }),
                });
                if (!response.ok) {
                    throw new Error(`Ошибка при открытии даты ${date}: ${response.statusText}`);
                }
                updatedDates.push(date);
            }

            setFetchedAvailability(prev =>
                prev.map(item =>
                    updatedDates.includes(item.date) ? { ...item, available: true } : item
                )
            );

            setAvailabilityList(prev =>
                prev.map(item =>
                    updatedDates.includes(item.date) ? { ...item, available: true } : item
                )
            );
            setClosedSelectedDates(new Set());
            setSelectedDate(null);
        } catch (err:any) {
            console.error("Ошибка при открытии даты:", err);
            setError(err.message);
        } finally {
            setIsAvailabilityChanging(false);
        }
    };

    // Обработчик изменения комментария
    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
        setComments((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    // Обработчик выбора установщика
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
        setSelectedTag((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    // Отправка данных на сервер
    const postData = async (orderId: number) => {
        try {
            const selectedInstaller = installers.find(
                (installer) => installer.id === selectedTag[orderId]
            );
            const installerFullName = selectedInstaller ? selectedInstaller.fullName : '';

            const response = await fetch(urlPost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    installerComment: comments[orderId] || '',
                    installerFullName: installerFullName,
                }),
            });

            if (!response.ok) {
                throw new Error(`Не удалось отправить данные: ${response.status} ${response.statusText}`);
            }

            if (!response.ok) {
                throw new Error(`Не удалось отправить данные: ${response.status} ${response.statusText}`);
            }

            // console.log(" Успешно отправлено", orderId);
            //
            // setOrders((prevOrders) => {
            //     const filtered = prevOrders.filter((order) => order.id !== String(orderId));
            //     console.log("⏱ До:", prevOrders.length, "→ После:", filtered.length);
            //     return filtered;
            // });

            await fetchOrders()

        } catch (err:any) {
            console.error('Ошибка при отправке данных:', err);
            setError(err.message);
        }
    };


 const handleAvailabilityPageChange = (newPage:number) => {
        if (newPage >= 0 && newPage < Math.ceil(availabilityList.length / recordsPerPage)) {
            setCurrentAvailabilityPage(newPage);
        }
    };

    const totalAvailabilityPages = Math.ceil(availabilityList.length / recordsPerPage);
    const paginatedAvailabilityList = availabilityList.slice(
        currentAvailabilityPage * recordsPerPage,
        (currentAvailabilityPage + 1) * recordsPerPage
    );

    const handleDateSelected = (dateStr:string) => {
        setSelectedDates(prev => {
            const newSet = new Set(prev);
            if (newSet.has(dateStr)) {
                newSet.delete(dateStr);
            } else {
                newSet.add(dateStr);
            }
            return newSet;
        });
    };

    const refreshAvailabilityData = async () => {
        try {
            const res = await fetch("/api/orders/create");
            if (!res.ok) throw new Error('Ошибка загрузки данных доступности');
            const data: OrderResponseMainInstaller = await res.json();
            setFetchedAvailability(data.availabilityList || []);
            setAvailabilityList(
                (data.availabilityList || []).map(item => ({
                    ...item,
                    formattedDate: reversedDate(item.date),
                }))
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="main-installer">
            <Header navItems={navItems} />

            <div className="main-installer__content">
                <h2 className="main-installer__title">Панель установщика</h2>

                <main className="main-installer__main">
                    {isOrdersLoading && <div className="main-installer__loading">Загрузка...</div>}

                    {error && (
                        <div className="main-installer__error">
                            <h3 className="main-installer__error-title">Ошибка: {error}</h3>
                            <button className="main-installer__retry-btn" onClick={fetchOrders}>
                                Повторить
                            </button>
                        </div>
                    )}

                    {!isOrdersLoading && !error && orders.length === 0 && (
                        <div className="main-installer__no-orders">Заказы не найдены</div>
                    )}

                    {!isOrdersLoading && !error && orders.length > 0 && (
                        <div className="main-installer__orders-block">
                            <MainInstallerTable
                                reversedDate={reversedDate}
                                installers={installers}
                                orders={orders}
                                comments={comments}
                                selectedTag={selectedTag}
                                handleCommentChange={handleCommentChange}
                                handleChange={handleChange}
                                postData={postData}
                                workloadByDate={workloadByDate}
                            />

                            <Pagination
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                totalPages={totalPages}
                            />
                        </div>
                    )}
                </main>

                <div className="main-installer__calendar-block">
                    <div className="main-installer__calendar-controls">
                        <CustomCalendar
                            availabilityList={availabilityList}
                            fetchedAvailability={fetchedAvailability}
                            setSelectedDate={setSelectedDate}
                            onDateSelected={handleDateSelected}
                            selectedDate={selectedDate}
                            canSelectClosedDays={true}
                            closedSelectedDates={closedSelectedDates}
                            setClosedSelectedDates={setClosedSelectedDates}
                        />

                        <div className="main-installer__buttons">
                            <button
                                className="main-installer__btn main-installer__btn--close"
                                onClick={closeDateCalendar}
                                disabled={!selectedDate || isAvailabilityChanging}
                            >
                                <img src={shutdownSvg} alt="Закрыть"/>
                            </button>

                            <button
                                className="main-installer__btn main-installer__btn--open"
                                onClick={openDates}
                                disabled={closedSelectedDates.size === 0 || isAvailabilityChanging}
                            >
                                <img src={openSvg} alt="Открыть"/>
                            </button>

                            <div className="main-installer__btn-wrapper">
                                <button
                                    onClick={() => setOpenCalendarDateChange(prev => !prev)}
                                    disabled={!selectedDate || isAvailabilityChanging}
                                    className="main-installer__btn main-installer__btn--change"
                                >
                                    <img src={changeDataSvg} alt="Изменить" />
                                </button>

                                {openCalendarDateChange && (
                                    <ChangeDoorsLimit
                                        frontDoorQuantity={selectedAvailability?.frontDoorQuantity || 0}
                                        inDoorQuantity={selectedAvailability?.inDoorQuantity || 0}
                                        selectedDate={selectedDate}
                                        setOpenCalendarDateChange={setOpenCalendarDateChange}
                                        refreshAvailabilityData={refreshAvailabilityData}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="main-installer__availability-table-block">
                        <table className="main-installer__table">
                            <thead className="main-installer__table-head">
                            <tr>
                                <th>Дата</th>
                                <th>Доступные входные двери</th>
                                <th>Доступные межкомнатные двери</th>
                            </tr>
                            </thead>
                            <tbody className="main-installer__table-body">
                            {paginatedAvailabilityList.map((availability, index) => (
                                <tr key={index} className="main-installer__table-row">
                                    <td>{availability.formattedDate}</td>
                                    <td>{availability.frontDoorQuantity}</td>
                                    <td>{availability.inDoorQuantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="main-installer__pagination">
                            <button
                                onClick={() => handleAvailabilityPageChange(currentAvailabilityPage - 1)}
                                disabled={currentAvailabilityPage === 0}
                                className="main-installer__pagination-btn"
                            >
                                {"<"}
                            </button>

                            <div className="main-installer__pagination-pages">
                                {Array.from({ length: totalAvailabilityPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAvailabilityPageChange(index)}
                                        className={`main-installer__pagination-number ${index === currentAvailabilityPage ? "main-installer__pagination-number--active" : ""}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handleAvailabilityPageChange(currentAvailabilityPage + 1)}
                                disabled={currentAvailabilityPage >= totalAvailabilityPages - 1}
                                className="main-installer__pagination-btn"
                            >
                                {">"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <Popup navItems={navItems}/>
        </div>

    );
};
