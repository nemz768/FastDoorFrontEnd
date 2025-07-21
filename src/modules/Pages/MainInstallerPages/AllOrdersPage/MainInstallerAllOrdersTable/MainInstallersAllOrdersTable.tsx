import React from 'react';
import {Order, EditedOrder} from '../../../../Interfaces/Interfaces'
import {installersType, InstallerWorkload} from "../../MainInstallerPage/MainInstallerPage";



interface OrderMainInstaller extends Order {
    messageMainInstaller?: string | null;
}

interface MainInstallersAllOrdersTableProps {
    installers: installersType[];
    orders: OrderMainInstaller[];
    reversedDate: (date: string) => string;
    updateOrders: (id: string) => void;
    editedOrder: EditedOrder;
    setEditedOrder: React.Dispatch<React.SetStateAction<EditedOrder>>;
    setOrderId: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedTag: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    selectedTag: Record<string, string>;
    orderId: string | null;
    deleteOrder: (id: string) => void;
    workloadByDate: Record<string, InstallerWorkload[]>;
    highlightedRowId: string | null;
}

export const MainInstallersAllOrdersTable:React.FC<MainInstallersAllOrdersTableProps> = ({orders, reversedDate, updateOrders,
                                                 editedOrder,setEditedOrder, setOrderId, setSelectedTag,
                                                 selectedTag, orderId, deleteOrder, installers, workloadByDate, highlightedRowId}) => {


    const getWorkloadForInstaller = (installerId: string, date: string) => {
        const workloads = workloadByDate[date] || [];
        const workload = workloads.find((w) => w.installerFullName === installers.find((i) => i.id === installerId)?.fullName);
        if (workload) {
            return `Входные: ${workload.frontDoorQuantity}, Межкомнатные: ${workload.inDoorQuantity}`;
        }
        return 'Нет данных';
    };

    const handleChangeButton = (order: OrderMainInstaller) => {
        setOrderId(order.id);

        setEditedOrder({
            messageMainInstaller: order.messageMainInstaller || '',
            installerName: order.installerName || ''
        });

        const installer = installers.find(inst => inst.fullName === order.installerName);
        setSelectedTag(prev => ({
            ...prev,
            [order.id]: installer?.id || ''
        }));
    }


    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
        setSelectedTag((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };


    const handleCancel = () => {
        setOrderId(null);
        setEditedOrder({
            messageMainInstaller: '',
            installerName: ''
        });
        setSelectedTag(prev => {
            const updated = {...prev};
            delete updated[Number(orderId)];
            return updated;
        });
    }

    return (
        <>
            <table style={{border:"1px solid black"}}  className='mainInstallerTable'>
                <thead>
                <tr>
                    <th>ФИО</th>
                    <th>Адрес доставки</th>
                    <th>Филиал</th>
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
                    <tr key={order.id}
                        className={highlightedRowId === order.id ? "bg-green-400 transition-colors" : ""}
                    >

                        <td>{order.fullName}</td>

                        <td>{order.address}</td>

                        <td>{order.nickname}</td>

                        <td>{order.dateOrder ? reversedDate(order.dateOrder) : ''}</td>

                        <td>{order.phone}</td>

                        <td>{order.frontDoorQuantity}</td>

                        <td>{order.inDoorQuantity}</td>

                        <td>{order.messageSeller}</td>
                        <td>
                            {
                                orderId === order.id
                                ? <input value={String(editedOrder.messageMainInstaller)}
                                        onChange={(e)=>
                                        setEditedOrder((prev)=>
                                            ({...prev, messageMainInstaller: e.target.value}))} defaultValue={order.messageMainInstaller || ''}
                                         className="bg-white"
                                         type="text"/>
                                : order.messageMainInstaller || "Нет"
                            }

                        </td>
                        <td>
                            {
                                orderId === order.id
                                    ? (
                                        <select
                                            className="bg-white"
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
                                    )
                                    : order.installerName ||  "Не выставлен"
                            }
                        </td>
                        <td className="TableTdBtns">
                            {
                                orderId === order.id
                                    ? <div>
                                        <button   className="standartBtn" onClick={()=> updateOrders(order.id)}>Сохранить</button>
                                        <button   className="standartBtn" onClick={handleCancel}>Отмена</button>
                                    </div>
                                    :<div>
                                        <button   className="standartBtn" onClick={()=> handleChangeButton(order)}>Изменить</button>
                                        <button   className="standartBtn" onClick={()=> deleteOrder(order.id)}>Удалить</button>
                                    </div>
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

