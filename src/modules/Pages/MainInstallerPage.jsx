import React, {useEffect, useState} from 'react';
import {Header} from "../Header.jsx";
import {Footer} from "../Footer.jsx";
import '../../styles/stylePages/mainInstallerPage.css'

export const MainInstallerPage = () => {

    const [orders, setOrders] = useState([]);
    const [installers, setInstallers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTag, setSelectedTag] = useState({});
    const [comments, setComments] = useState({}); // Controlled input for comments


    // const [nickName, setNickName] = useState('');
    // const [showButtonClear, setShowButtonClear] = useState(false);

    const url = `/api/mainInstaller?page=${currentPage}`;
    const urlPost = `/api/mainInstaller`;




    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // if (!response.ok) {
                //     throw new Error(`Не удалось загрузить заказы либо филиала ${nickName} не существует!`);
                // }
                const data = await response.json();
                console.log('API data:', data);
                setOrders(
                    data.orders.map((order) => ({
                        ...order,
                        id: String(order.id),
                    })) || []
                );
                setInstallers(
                    data.installers.map((inst) => (
                        {
                            ...inst,
                            id: String(inst.id),
                        }
                    ))
                )

                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
            } catch (err) {
                console.error('Ошибка загрузки заказов:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage]);

    const postData = async (orderId) => {

        console.log(selectedTag[orderId]);

        try {
            const response = await fetch(urlPost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    installerComment: comments[orderId] || '',
                    installerFullName: selectedTag[orderId] || '',
                })
            })
            const data = await response;
            console.log('POST res: ', data);
        }

        catch (err) {
            console.log(err)
        }
    }

    const handleCommentChange = (event, orderId) => {
        setComments((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };


    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };




    const handleChange = (event, orderId) => {
        setSelectedTag((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    // debounce, чтобы предотвратить постоянные запросы к api


    // const handleSearch = (value) => {
    //     setShowButtonClear(value !== '');
    //     setNickName(value);
    //     setCurrentPage(0);
    // }

    // const handleClearSearch = () => {
    //     setShowButtonClear(false);
    //     setNickName('');
    //     setCurrentPage(0);
    // }

    return (
        <div className='admin-panel'>
            <Header/>
            <main className="SellerAllOrdersPage">
                <div>
                    <h2>Панель установщика</h2>
                </div>
                {isLoading && <div className="loading">Загрузка...</div>}
                {error && (
                    <div className="error">
                        <h3>Ошибка: {error}</h3>
                        <button className="retry-button">
                            Повторить
                        </button>
                    </div>
                )}
                {!isLoading && !error && orders.length === 0 && (
                    <div className="no-orders">Заказы не найдены</div>
                )}
                {!isLoading && !error && orders.length > 0 && (
                    <>
                        <div className="table-container">
                            <table className="orders-table">
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
                                        <td>{order.dateOrder}</td>
                                        <td>{order.phone}</td>
                                        <td>{order.frontDoorQuantity}</td>
                                        <td>{order.inDoorQuantity}</td>
                                        <td>{order.messageSeller}</td>
                                        <td><input onChange={(event)=> handleCommentChange(event, order.id)} type="text"/></td>
                                        <td>
                                            <select
                                                value={selectedTag[order.id] || ''}
                                                onChange={(event) => handleChange(event, order.id)}
                                            >
                                                    <option id="optionDefault" value="">
                                                        Выбрать установщика
                                                    </option>
                                                {installers.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                                <button onClick={()=> postData(order.id)} disabled={!selectedTag[order.id]} id="ConfirmBtn">Подтвердить</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="pagination-button"
                            >
                                Предыдущая
                            </button>
                            <span className="pagination-info">
                Страница {currentPage + 1} из {totalPages}
              </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="pagination-button"
                            >
                                Следующая
                            </button>
                        </div>
                    </>
                )}
            </main>

            <Footer/>
        </div>
    );
};
