import React from 'react';
import { Order } from '../../../../Interfaces/Interfaces';
import { installersType, InstallerWorkload } from '../MainInstallerPage';
import './mainInstallerTable.css'


interface MainInstallerTableProps {
    reversedDate: (dateString: string) => string;
    installers: installersType[];
    orders: Order[];
    comments: Record<string, string>;
    selectedTag: Record<string, string>;
    handleCommentChange: (event: React.ChangeEvent<HTMLInputElement>, orderId: string) => void;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>, orderId: string) => void;
    postData: (orderId: number) => void;
    workloadByDate: Record<string, InstallerWorkload[]>;
}

export const MainInstallerTable: React.FC<MainInstallerTableProps> = ({
                                                                          reversedDate,
                                                                          installers,
                                                                          orders,
                                                                          comments,
                                                                          selectedTag,
                                                                          handleCommentChange,
                                                                          handleChange,
                                                                          postData,
                                                                          workloadByDate,
                                                                      }) => {
    const getWorkloadForInstaller = (installerId: string, date: string) => {
        const workloads = workloadByDate[date] || [];
        const workload = workloads.find((w) => w.installerFullName === installers.find((i) => i.id === installerId)?.fullName);
        if (workload) {
            return `Входные: ${workload.frontDoorQuantity}, Межкомнатные: ${workload.inDoorQuantity}`;
        }
        return 'Нет данных';
    };

    return (
        <table border={1} className="mainInstallerTable">
            <thead>
            <tr>
                <th>Адрес доставки</th>
                <th>Филиалы</th>
                <th>Дата установки</th>
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
                            placeholder="Ваш комментарий..."
                            className="mainInstallerTable-comment"
                            type="text"
                            value={comments[order.id] || ''}
                            onChange={(event) => handleCommentChange(event, order.id)}
                        />
                    </td>
                    <td>
                        <select
                            className="mainInstallerTable-select"
                            value={selectedTag[order.id] || ''}
                            onChange={(event) => handleChange(event, order.id)}
                        >
                            <option disabled value="">Выбрать установщика</option>
                            {installers.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {`${option.fullName} (${getWorkloadForInstaller(option.id, order.dateOrder)})`}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <button
                            className="mainInstallerTable-btn"
                            onClick={() => postData(Number(order.id))}
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
    );
};