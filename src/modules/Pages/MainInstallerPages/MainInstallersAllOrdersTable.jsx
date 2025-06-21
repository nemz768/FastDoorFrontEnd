import React from 'react';

export const MainInstallersAllOrdersTable = ({orders, reversedDate}) => {
    // const [comments, setComments] = useState({});
    //
    // const handleCommentChange = (event, orderId) => {
    //     setComments((prev) => ({
    //         ...prev,
    //         [orderId]: event.target.value,
    //     }));
    // };

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
                          {order.messageMainInstaller ? order.messageMainInstaller : "Нет"}
                        </td>
                        <td>
                            {order.installerName}
                        </td>
                        <td>
                            <button>
                                Изменить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

