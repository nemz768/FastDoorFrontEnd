import React, { useEffect, useState } from 'react';
import { Header } from '../../Header.jsx';
import { Footer } from '../../Footer.jsx';
import { CustomCalendar } from '../../special/CustomCalendar.jsx';
import '../../../styles/styleMainInstaller/MainInstallerPage.css'
import openSvg from '../../../assets/unlock-alt-svgrepo-com.svg'
import changeDataSvg from '../../../assets/change-management-backup-svgrepo-com.svg'
import shutdownSvg from '../../../assets/lock-alt-svgrepo-com.svg'
import {ChangeDoorsLimit} from "./ChangeDoorsLimit.jsx";

export const MainInstallerPage = () => {
    const [orders, setOrders] = useState([]);
    const [installers, setInstallers] = useState([]);
    const [fetchedAvailability, setFetchedAvailability] = useState([]);
    const [availabilityList, setAvailabilityList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [selectedTag, setSelectedTag] = useState({});
    const [comments, setComments] = useState({});
    const [currentAvailabilityPage, setCurrentAvailabilityPage] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const recordsPerPage = 10;
    const [isOrdersLoading, setIsOrdersLoading] = useState(false);
    const [isAvailabilityChanging, setIsAvailabilityChanging] = useState(false);
    const [closedSelectedDates, setClosedSelectedDates] = useState(new Set());

    const url = `/api/mainInstaller?page=${currentPage}`;
    const urlPost = `/api/mainInstaller`;

// changeDataCalendar
    const [openCalendarDateChange, setOpenCalendarDateChange] = useState(false);

    const [selectedDates, setSelectedDates] = useState(new Set());

    const navItems = [
        { label: 'Список установщиков', route: '/home/mainInstaller/InstallersList' },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
        { label: 'Список заказов', route: '/404' },
    ];

    // Форматирование даты в DD.MM.YYYY123
    const reversedDate = (dateString) => {
        const day = dateString.slice(8);
        const month = dateString.slice(5, 7);
        const year = dateString.slice(0, 4);
        return `${day}.${month}.${year}`;
    };

    // Получение данных о заказах и доступности123
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

            const data = await response.json();

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
        } catch (err) {
            console.error('Ошибка при загрузке заказов:', err);
            setError(err.message);
        } finally {
            setIsOrdersLoading(false)
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
        const updatedDates = [];

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
        } catch (err) {
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
        const updatedDates = [];

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
        } catch (err) {
            console.error("Ошибка при открытии даты:", err);
            setError(err.message);
        } finally {
            setIsAvailabilityChanging(false);
        }
    };

    // Обработчик изменения комментария
    const handleCommentChange = (event, orderId) => {
        setComments((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    // Обработчик выбора установщикаf
    const handleChange = (event, orderId) => {
        setSelectedTag((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    // Отправка данных на сервер
    const postData = async (orderId) => {
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

            fetchOrders();
        } catch (err) {
            console.error('Ошибка при отправке данных:', err);
            setError(err.message);
        }
    };

    // Обработчик смены страницы заказовd
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Обработчик смены страницы доступности
    const handleAvailabilityPageChange = (newPage) => {
        if (newPage >= 0 && newPage < Math.ceil(availabilityList.length / recordsPerPage)) {
            setCurrentAvailabilityPage(newPage);
        }
    };

    const totalAvailabilityPages = Math.ceil(availabilityList.length / recordsPerPage);
    const paginatedAvailabilityList = availabilityList.slice(
        currentAvailabilityPage * recordsPerPage,
        (currentAvailabilityPage + 1) * recordsPerPage
    );

    const handleDateSelected = (dateStr) => {
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



    return (
        <div className='mainInstallerTables-FullBlock'>
            <Header navItems={navItems} />

            <div className="mainInstallerTables-block">
                <h2>Панель установщика</h2>
                <main>
                    {isOrdersLoading  && <div className="loading">Загрузка...</div>}
                    {error && (
                        <div className="error">
                            <h3>Ошибка: {error}</h3>
                            <button className="retry-button" onClick={fetchOrders}>
                                Повторить
                            </button>
                        </div>
                    )}
                    {!isOrdersLoading && !error && orders.length === 0 && (
                        <div className="no-orders">Заказы не найдены</div>
                    )}
                    {!isOrdersLoading && !error && orders.length > 0 && (
                        <>
                            <table border="1" className='mainInstallerTable'>
                                <thead>
                                <tr>
                                    <th>Адрес доставки</th>
                                    <th>Филиалы</th>
                                    <th>Дата</th>
                                    <th>Номер телефона</th>
                                    <th>Количество входных дверей</th>
                                    <th>Количество межкомнатных дверей</th>
                                    <th>Комментарий продавца</th>
                                    <th>Ваш комментарий</th>
                                    <th>Установщик</th>
                                    <th>Действие</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.address}</td>
                                        <td>{order.nickname}</td>
                                        <td>{order.dateOrder}</td>
                                        <td>{order.phone}</td>
                                        <td>{order.frontDoorQuantity}</td>
                                        <td>{order.inDoorQuantity}</td>
                                        <td>{order.messageSeller}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={comments[order.id] || ''}
                                                onChange={(event) => handleCommentChange(event, order.id)}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                value={selectedTag[order.id] || ''}
                                                onChange={(event) => handleChange(event, order.id)}
                                            >
                                                <option value="">Выбрать установщика</option>
                                                {installers.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => postData(order.id)}
                                                disabled={!selectedTag[order.id]}
                                                id="ConfirmBtn"
                                            >
                                                Подтвердить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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

                <div className="MainInstallerPage__calendar-dateTable-block">
                    <div>
                        <CustomCalendar
                            selectedDates={selectedDates}
                            setSelectedDates={setSelectedDates}
                            setFetchedAvailability={setFetchedAvailability}
                            availabilityList={availabilityList}
                            fetchedAvailability={fetchedAvailability}
                            setSelectedDate={setSelectedDate}
                            onDateSelected={handleDateSelected}
                            selectedDate={selectedDate}
                            canSelectClosedDays={true}
                            closedSelectedDates={closedSelectedDates}
                            setClosedSelectedDates={setClosedSelectedDates}
                        />

                        <button className="Calendar-Button-MainInstaller" onClick={closeDateCalendar} disabled={!selectedDate || isAvailabilityChanging}>
                            <img src={shutdownSvg} alt="shutdown"/>
                        </button>
                        <button className="Calendar-Button-MainInstaller" onClick={openDates}
                                 disabled={closedSelectedDates.size === 0 || isAvailabilityChanging}>
                             <img src={openSvg} alt="shutdown"/>
                        </button>

                        <div>
                            <button onClick={()=> {setOpenCalendarDateChange(true)
                            }} disabled={!selectedDate || isAvailabilityChanging}
                                 className="Calendar-Button-MainInstaller">
                                <img src={changeDataSvg} alt="shutdown"/>
                            </button>

                            {openCalendarDateChange && <ChangeDoorsLimit
                                selectedDate={selectedDate}
                                setOpenCalendarDateChange={setOpenCalendarDateChange}
                                openCalendarDateChange={openCalendarDateChange}
                            />}
                        </div>
                    </div>
                    <div>
                        <table className="table-dates" border="1">
                            <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Доступные входные двери</th>
                                <th>Доступные межкомнатные двери</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedAvailabilityList.map((availability, index) => (
                                <tr key={index}>
                                    <td>{availability.formattedDate}</td>
                                    <td>{availability.frontDoorQuantity}</td>
                                    <td>{availability.inDoorQuantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button
                                onClick={() => handleAvailabilityPageChange(currentAvailabilityPage - 1)}
                                disabled={currentAvailabilityPage === 0}
                                className="pagination-button"
                            >
                                Предыдущая
                            </button>
                            <span className="pagination-info">
                                Страница {currentAvailabilityPage + 1} из {totalAvailabilityPages}
                            </span>
                            <button
                                onClick={() => handleAvailabilityPageChange(currentAvailabilityPage + 1)}
                                disabled={currentAvailabilityPage >= totalAvailabilityPages - 1}
                                className="pagination-button"
                            >
                                Следующая
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};