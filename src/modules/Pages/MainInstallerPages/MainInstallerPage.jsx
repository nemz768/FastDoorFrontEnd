import React, { useEffect, useState } from 'react';
import { Header } from '../../Header.jsx';
import { Footer } from '../../Footer.jsx';
import '../../../styles/stylePages/MainInstaller.scss';
import { CustomCalendar } from '../../special/CustomCalendar.jsx';

export const MainInstallerPage = () => {
    const [orders, setOrders] = useState([]);
    const [installers, setInstallers] = useState([]);
    const [fetchedAvailability, setFetchedAvailability] = useState([]);
    const [availabilityList, setAvailabilityList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTag, setSelectedTag] = useState({});
    const [comments, setComments] = useState({});
    const [currentAvailabilityPage, setCurrentAvailabilityPage] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const recordsPerPage = 10;

    const url = `/api/mainInstaller?page=${currentPage}`;
    const urlPost = `/api/mainInstaller`;

    const navItems = [
        { label: 'Список установщиков', route: '/home/mainInstaller/InstallersList' },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
        { label: 'Список заказов', route: '/404' },
    ];

    // Форматирование даты в DD.MM.YYYY
    const reversedDate = (dateString) => {
        const day = dateString.slice(8);
        const month = dateString.slice(5, 7);
        const year = dateString.slice(0, 4);
        return `${day}.${month}.${year}`;
    };

    // Получение данных о заказах и доступности
    const fetchOrders = async () => {
        setIsLoading(true);
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
            setIsLoading(false);
        }
    };

    // Получение данных о доступности дверей
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
    }, [availabilityList]);

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    // Обработчик изменения комментария
    const handleCommentChange = (event, orderId) => {
        setComments((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    // Обработчик выбора установщика
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

    // Обработчик смены страницы заказов
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
        setSelectedDate(dateStr);
    };
    return (
        <div>
            <Header navItems={navItems} />
            <div className="MainInstallerPage__block">
                <div className="MainInstallerPage__table-calendar-block">
                    <main className="SellerAllOrdersPage">
                        <div>
                            <h2>Панель установщика</h2>
                        </div>
                        {isLoading && <div className="loading">Загрузка...</div>}
                        {error && (
                            <div className="error">
                                <h3>Ошибка: {error}</h3>
                                <button className="retry-button" onClick={fetchOrders}>
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
                                </div>
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
                                availabilityList={availabilityList}
                                fetchedAvailability={fetchedAvailability}
                                setSelectedDate={setSelectedDate}
                                onDateSelected={handleDateSelected}
                                selectedDate={selectedDate}
                            />
                            <button>Закрыть день!</button>
                        </div>
                        <div>
                            <table border="1">
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
            </div>
            <Footer />
        </div>
    );
};