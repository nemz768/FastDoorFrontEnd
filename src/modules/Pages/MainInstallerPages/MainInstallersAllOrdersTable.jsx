import React, {useState} from 'react';

export const MainInstallersAllOrdersTable = ({orders, reversedDate}) => {
    const [changeBtn, setChangeBtn] = useState(true);
    const [confirmBtn, setConfirmBtn] = useState(false);


    const handleChangeButton = () => {
        setChangeBtn(false)
        setConfirmBtn(true)
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
                            {confirmBtn && (
                                <button>
                                    Подтвердить
                                </button>
                            )}
                            {
                                changeBtn && (
                                    <button onClick={handleChangeButton}>
                                        Изменить
                                    </button>
                                )
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

