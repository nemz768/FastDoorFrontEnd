import React, {useState} from 'react';

export const MainInstallersAllOrdersTable = ({orders, reversedDate}) => {
    const [orderId, setOrderId] = useState(null);
    const [selectedTag, setSelectedTag] = useState({});
    const [editedOrder, setEditedOrder] = useState({
        messageMainInstaller: '',
        frontDoorQuantity: 0,
        inDoorQuantity: 0
    });

    const handleChangeButton = (order) => {
        setOrderId(order.id);
        setEditedOrder({
            messageMainInstaller: order.messageMainInstaller,
            frontDoorQuantity: order.frontDoorQuantity,
            inDoorQuantity: order.inDoorQuantity });

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
    }

    return (
        <>
            <table border="1" className='mainInstallerTable'>
                <thead>
                <tr>
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
                        <td>{order.address}</td>
                        <td>{order.nickname}</td>
                        <td>{reversedDate(order.dateOrder)}</td>
                        <td>{order.phone}</td>

                        {
                            orderId === order.id
                            ?   <>
                                    <td>
                                        <input value={editedOrder.frontDoorQuantity}
                                               defaultValue={order.frontDoorQuantity}
                                               onChange={(e)=> setEditedOrder((prev) => ({...prev, frontDoorQuantity: e.target.value }))}
                                               type="text"/>
                                    </td>
                                    <td>
                                        <input value={editedOrder.inDoorQuantity}
                                               defaultValue={order.inDoorQuantity}
                                               onChange={(e)=> setEditedOrder((prev) => ({...prev, inDoorQuantity: e.target.value }))}

                                               type="text"/>
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
                                            <option key={order.id} value={order.installerName}>
                                                {orders.map((item)=> {
                                                    item.installerName
                                                })}
                                            </option>
                                        </select>
                                    )
                                    : order.installerName ||  "Не выставлен"
                            }



                        </td>
                        <td>
                            {
                                orderId === order.id
                                    ? <div>
                                        <button>Сохранить</button>
                                        <button onClick={handleCancel}>Отмена</button>
                                    </div>
                                    :<div>
                                        <button onClick={()=> handleChangeButton(order)}>Изменить</button>
                                        <button>Удалить</button>
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

