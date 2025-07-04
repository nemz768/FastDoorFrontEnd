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
    const [workloadData, setWorkloadData] = useState({}); // данные нагрузки установщиков по дате

    // Устанавливаем дату из первого заказа (чтобы загрузить нагрузку по дате)
    useEffect(() => {
        if (orders && orders.length > 0) {
            setDate(orders[0].dateOrder);
        }
    }, [orders]);

    // Загружаем данные нагрузок установщиков по выбранной дате
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
                // Ожидается объект: { "installerId": число нагрузки, ... }
                setWorkloadData(data);
            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
            }
        };

        getApiOrdersInstallers();
    }, [date]);

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
                            <select
                                value={selectedTag[order.id] || ""}
                                onChange={(event) => handleChange(event, order.id)}
                            >
                                <option value="">Выбрать установщикаff</option>
                                {installers.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.fullName}{" "}
                                        {workloadData[option.id] !== undefined
                                            ? `(${workloadData[option.id]})`
                                            : ""}
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
        </>
    );
};
