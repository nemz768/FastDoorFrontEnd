import React from "react";

export const MainInstallerTable = ({reversedDate,installers, orders, comments,
                                       selectedTag, handleCommentChange, handleChange,
                                       postData}) => {
    return (
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
                        <td>{reversedDate(order.dateOrder)}</td>
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
        </>
    );
};

