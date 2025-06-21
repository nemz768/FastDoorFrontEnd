import React, {useState} from 'react';

export const MainInstallersAllOrdersTable = ({orders, reversedDate}) => {
    const [installerId, setInstallerId] = useState(null);



    const handleChangeButton = (installer) => {
        setInstallerId(installer.id);

    }

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
                          {order.messageMainInstaller || "Нет"}
                        </td>
                        <td>
                            {order.installerName ||  "Не выставлен"}
                        </td>
                        <td>
                            {
                                installerId === order.id
                                    ? <div>
                                        <button>Подтвердить</button>
                                        <button>Отмена</button>
                                    </div>
                                    :<div>
                                        <button onClick={()=> handleChangeButton(order.id)}>Изменить</button>
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

