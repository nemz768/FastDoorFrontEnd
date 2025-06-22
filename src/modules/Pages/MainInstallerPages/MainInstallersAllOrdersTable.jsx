import React from 'react';

export const MainInstallersAllOrdersTable = ({orders, reversedDate, updateOrders,
                                                 editedOrder,setEditedOrder, setOrderId, setSelectedTag,
                                                 selectedTag, orderId, deleteOrder}) => {

    const uniqueInstallers = [...new Set(
        orders.filter(order => order.installerName).map(order => order.installerName)
    )];

    const handleChangeButton = (order) => {
        setOrderId(order.id)
        setEditedOrder({
            messageMainInstaller: order.messageMainInstaller,
            frontDoorQuantity: order.frontDoorQuantity,
            inDoorQuantity: order.inDoorQuantity,
            installerName: order.installerName || ''
        });

        setSelectedTag(prev => ({
            ...prev,
            [order.id]: order.installerName || ''
        }));

    }

    const handleChange = (event, orderId)=>{
        setSelectedTag(prev => ({
            ...prev,
            [orderId]: event.target.value,
        }))
    }

    const handleCancel = () => {
        setOrderId(null);
        setEditedOrder({
            messageMainInstaller: '',
            frontDoorQuantity: 0,
            inDoorQuantity: 0
        });
        setSelectedTag(prev => {
            const updated = {...prev};
            delete updated[orderId];
            return updated;
        });
    }

    return (
        <>
            <table border="1" className='mainInstallerTable'>
                <thead>
                <tr>
                    <th>ФИО</th>
                    <th>Адрес доставки</th>
                    <th>Филиал</th>
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
                        <td>{order.fullName}</td>
                        <td>{order.address}</td>
                        <td>{order.nickname}</td>
                        <td>{order.dateOrder ? reversedDate(order.dateOrder) : ''}</td>
                        <td>{order.phone}</td>

                        {
                            orderId === order.id
                            ?   <>
                                    <td>
                                        <input value={editedOrder.frontDoorQuantity}
                                              onChange={(e)=> setEditedOrder((prev) => ({...prev, frontDoorQuantity: e.target.value }))}
                                               type="number"
                                                min="0"
                                        />
                                    </td>
                                    <td>
                                        <input value={editedOrder.inDoorQuantity}
                                               onChange={(e)=> setEditedOrder((prev) => ({...prev, inDoorQuantity: e.target.value }))}
                                               type="number"
                                               min="0"

                                        />

                                    </td>
                                </>
                                : <>
                                    <td>{order.frontDoorQuantity}</td>
                                    <td>{order.inDoorQuantity}</td>
                                </>
                        }




                        <td>{order.messageSeller}</td>
                        <td>
                            {
                                orderId === order.id
                                ? <input value={editedOrder.messageMainInstaller}
                                        onChange={(e)=>
                                        setEditedOrder((prev)=>
                                            ({...prev, messageMainInstaller: e.target.value}))} defaultValue={order.messageMainInstaller || ''}
                                         type="text"/>
                                : order.messageMainInstaller || "Нет"
                            }

                        </td>
                        <td>
                            {
                                orderId === order.id
                                    ? (
                                        <select
                                            value={selectedTag[order.id] || ''}
                                            onChange={(event) => handleChange(event, order.id)}
                                        >
                                            <option value="">Выбрать установщика</option>
                                                {uniqueInstallers.map((installer) => (
                                                    <option key={installer} value={installer}>
                                                        {installer}
                                                    </option>
                                                ))}
                                        </select>
                                    )
                                    : order.installerName ||  "Не выставлен"
                            }
                        </td>
                        <td>
                            {
                                orderId === order.id
                                    ? <div>
                                        <button onClick={()=> updateOrders(order.id)}>Сохранить</button>
                                        <button onClick={handleCancel}>Отмена</button>
                                    </div>
                                    :<div>
                                        <button onClick={()=> handleChangeButton(order)}>Изменить</button>
                                        <button onClick={()=> deleteOrder(order.id)}>Удалить</button>
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

