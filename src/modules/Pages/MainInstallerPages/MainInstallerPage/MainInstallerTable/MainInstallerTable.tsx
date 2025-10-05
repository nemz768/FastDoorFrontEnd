import React from 'react';
import { Order } from '../../../../Interfaces/Interfaces';
import { installersType, InstallerWorkload } from '../MainInstallerPage';
import './mainInstallerTable.scss'


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
        <table className="main-installer__table">
            <thead className="main-installer__table-head">
            <tr className="main-installer__table-row">
                <th className="main-installer__table-cell">Адрес доставки</th>
                <th className="main-installer__table-cell">Филиалы</th>
                <th className="main-installer__table-cell">Дата установки</th>
                <th className="main-installer__table-cell">Номер телефона</th>
                <th className="main-installer__table-cell">Количество входных дверей</th>
                <th className="main-installer__table-cell">Количество межкомнатных дверей</th>
                <th className="main-installer__table-cell">Комментарий продавца</th>
                <th className="main-installer__table-cell">Ваш комментарий</th>
                <th className="main-installer__table-cell">Установщик</th>
                <th className="main-installer__table-cell">Действие</th>
            </tr>
            </thead>
            <tbody className="main-installer__table-body">
            {orders.map((order) => (
                <tr key={order.id} className="main-installer__table-row">
                    <td className="main-installer__table-cell">{order.address}</td>
                    <td className="main-installer__table-cell">{order.nickname}</td>
                    <td className="main-installer__table-cell">{reversedDate(order.dateOrder)}</td>
                    <td className="main-installer__table-cell">{order.phone}</td>
                    <td className="main-installer__table-cell">{order.frontDoorQuantity}</td>
                    <td className="main-installer__table-cell">{order.inDoorQuantity}</td>
                    <td className="main-installer__table-cell">{order.messageSeller}</td>
                    <td className="main-installer__table-cell">
                        <input
                            type="text"
                            placeholder="Ваш комментарий..."
                            className="main-installer__table-input"
                            value={comments[order.id] || ''}
                            onChange={(event) => handleCommentChange(event, order.id)}
                        />
                    </td>
                    <td className="main-installer__table-cell">
                        <select
                            className="main-installer__table-select"
                            value={selectedTag[order.id] || ''}
                            onChange={(event) => handleChange(event, order.id)}
                        >
                            <option disabled value="">
                                Выбрать установщика
                            </option>
                            {installers.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {`${option.fullName} (${getWorkloadForInstaller(option.id, order.dateOrder)})`}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="main-installer__table-cell">
                        <button
                            className="main-installer__table-btn"
                            onClick={() => postData(Number(order.id))}
                            disabled={!selectedTag[order.id]}
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