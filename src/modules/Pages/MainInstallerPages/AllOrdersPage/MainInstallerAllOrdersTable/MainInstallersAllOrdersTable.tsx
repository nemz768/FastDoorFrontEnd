import React from 'react';
import {Order, EditedOrder} from '../../../../Interfaces/Interfaces'
import {installersType, InstallerWorkload} from "../../MainInstallerPage/MainInstallerPage";
import "./AllOrdersTable.scss"

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

    const [expandedOrderId, setExpandedOrderId] = React.useState<string | null>(null);


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

    const renderCommentCell = (order: OrderMainInstaller) => {
        if (orderId === order.id) {
            return (
                <input
                    value={String(editedOrder.messageMainInstaller)}
                    onChange={(e) =>
                        setEditedOrder((prev) => ({
                            ...prev,
                            messageMainInstaller: e.target.value,
                        }))
                    }
                    className="bg-white"
                    type="text"
                />
            );
        }
        return order.messageMainInstaller || "Нет";
    };

    const renderInstallerCell = (order: OrderMainInstaller) => {
        if (orderId === order.id) {
            return (
                <select
                    className="bg-white"
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
            );
        }
        return order.installerName || "Не выставлен";
    };


    return (
        <>
            <div className="AllOrders">
                <table className="AllOrders__orders-table" style={{border:"1px solid black"}}>
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
                                {renderCommentCell(order)}
                            </td>
                            <td>
                                    {
                                        renderInstallerCell(order)
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

                <div className="AllOrders-mobile">
                    {orders.map(order => (
                        <div key={order.id} className="orders-mobile-AllOrders">
                            <div  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} className="orders-mobile-address">

                                <h1>{order.address}</h1>
                            </div>



                            <div
                                className={`orders-mobile-info-block ${
                                    expandedOrderId === order.id ? 'expanded' : 'collapsed'
                                }`}
                            >
                                    <div className="orders-mobile-info">
                                        ФИО <strong>{order.fullName}</strong>
                                    </div>
                                    <div className="orders-mobile-info">
                                        Номер <strong>{order.phone}</strong>
                                    </div>
                                    <div className="orders-mobile-info">
                                        Дата <strong>{reversedDate(order.dateOrder)}</strong>
                                    </div>
                                    <div className="orders-mobile-info">
                                        Входные двери <strong>{order.frontDoorQuantity}</strong>
                                    </div>
                                    <div className="orders-mobile-info">
                                        Межкомнатные двери <strong>{order.inDoorQuantity}</strong>
                                    </div>
                                    <div className="orders-mobile-info">
                                        Установщик
                                        <strong>
                                            {
                                                renderInstallerCell(order)
                                            }
                                        </strong>

                                    </div>
                                    <div className="orders-mobile-info">
                                        Ваш комментарий <strong> {renderCommentCell(order)}</strong>
                                    </div>
                                    <div className="AllOrders-mobile-info-last">
                                        {
                                            orderId === order.id
                                                ? <div className="AllOrders-mobile-info-btns">
                                                    <button   className="standartBtn" onClick={()=> updateOrders(order.id)}>Сохранить</button>
                                                    <button   className="standartBtn" onClick={handleCancel}>Отмена</button>
                                                </div>
                                                :<div className="AllOrders-mobile-info-btns">
                                                    <button   className="standartBtn" onClick={()=> handleChangeButton(order)}>Изменить</button>
                                                    <button   className="standartBtn" onClick={()=> deleteOrder(order.id)}>Удалить</button>
                                                </div>
                                        }
                                    </div>
                                </div>
                        </div>
                    ))}

                </div>

            </div>

        </>
    );
};

