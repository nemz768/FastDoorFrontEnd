import React, { useEffect, useState } from "react";

export const MainInstallerTable = ({
                                       reversedDate,
                                       installers,
                                       orders,
                                       comments,
                                       selectedTag,
                                       handleCommentChange,
                                       handleChange,
                                       postData,
                                   }) => {
    const [date, setDate] = useState(null);
    const [workloadData, setWorkloadData] = useState({}); // { "installerId": { B: number, M: number } }
    const [isOpen, setIsOpen] = useState({}); // Состояние для открытия/закрытия селекта по orderId

    // Устанавливаем дату из первого заказа
    useEffect(() => {
        if (orders && orders.length > 0) {
            setDate(orders[0].dateOrder);
        }
    }, [orders]);

    // Загружаем данные нагрузок установщиков
    useEffect(() => {
        if (!date) return;

        const getApiOrdersInstallers = async () => {
            try {
                const response = await fetch(
                    `/api/listInstallers/workload?date=${encodeURIComponent(date)}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await response.json();
                setWorkloadData(data);
            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
            }
        };

        getApiOrdersInstallers();
    }, [date]);

    // Toggle для открытия/закрытия выпадающего списка
    const toggleSelect = (orderId) => {
        setIsOpen((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    // Обработчик выбора установщика
    const handleSelect = (orderId, installerId) => {
        handleChange(orderId, installerId); // Предполагается, что handleChange обновляет selectedTag
        setIsOpen((prev) => ({ ...prev, [orderId]: false })); // Закрываем список после выбора
    };

    return (
        <>
            <table border="1" className="mainInstallerTable">
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
                        <td>{reversedDate(order.dateOrder)}</td>
                        <td>{order.phone}</td>
                        <td>{order.frontDoorQuantity}</td>
                        <td>{order.inDoorQuantity}</td>
                        <td>{order.messageSeller}</td>
                        <td>
                            <input
                                type="text"
                                value={comments[order.id] || ""}
                                onChange={(event) => handleCommentChange(event, order.id)}
                            />
                        </td>
                        <td>
                            <div className="custom-select">
                                <div
                                    className="select-header"
                                    onClick={() => toggleSelect(order.id)}
                                >
                                    {selectedTag[order.id] ? (
                                        <div>
                                            <div>{installers.find((i) => i.id === selectedTag[order.id])?.fullName || "Выберите установщика"}</div>
                                            <div>B: {workloadData[selectedTag[order.id]]?.inDoorQuantity ?? 0}</div>
                                            <div>M: {workloadData[selectedTag[order.id]]?.frontDoorQuantity ?? 0}</div>
                                        </div>
                                    ) : (
                                        "Выберите установщика"
                                    )}
                                </div>
                                {isOpen[order.id] && (
                                    <div className="options-list">
                                        {installers.map((option) => (
                                            <div
                                                key={option.id}
                                                className="custom-option"
                                                onClick={() => handleSelect(order.id, option.id)}
                                            >
                                                <div>{option.fullName}</div>
                                                <div>B: {workloadData[option.id]?.inDoorQuantity ?? 0}</div>
                                                <div>M: {workloadData[option.id]?.frontDoorQuantity ?? 0}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
        </>
    );
};