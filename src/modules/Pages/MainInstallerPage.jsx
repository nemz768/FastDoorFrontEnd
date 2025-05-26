import React, {useEffect, useState, useRef} from 'react';
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

    const handleChange = (event, orderId) => {
        setSelectedTag((prev) => ({
            ...prev,
            [orderId]: event.target.value,
        }));
    };

    const refs = {
        id: useRef(null),
        address: useRef(null),
        nickname: useRef(null),
        dateOrder: useRef(null),
        phone: useRef(null),
        frontDoorQuantity : useRef(null),
        inDoorQuantity: useRef(null),
        messageSeller: useRef(null),
        message: useRef(null),
        installer: useRef(null)
    }


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

    const postData = async () => {
        const id = refs.id.current.value;
        const address = refs.address.current.value;
        const nickname = refs.nickname.current.value;
        const dateOrder = refs.dateOrder.current.value;
        const phone = refs.phone.current.value;
        const frontDoorQuantity = refs.frontDoorQuantity.current.value;
        const inDoorQuantity = refs.inDoorQuantity.current.value;
        const messageSeller = refs.messageSeller.current.value;
        const message = refs.message.current.value;
        const installer = refs.installer.current.value;

        try {
            const response = await fetch(urlPost, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    address: address,
                    nickname: nickname,
                    dateOrder: dateOrder,
                    phone: phone,
                    frontDoorQuantity: frontDoorQuantity,
                    inDoorQuantity: inDoorQuantity,
                    messageSeller: messageSeller,
                    message: message,
                    installer: installer
                })
            })
            const data = await response.json();
            console.log(data)
        }

        catch (err) {
            console.log(err)
        }



    }

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
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
                    {/*<div className="InputBlock">*/}
                    {/*    <input*/}
                    {/*        className="inputFind"*/}
                    {/*        onChange={(e)=> handleSearch(e.target.value)}*/}
                    {/*        type="search"*/}
                    {/*        value={nickName}*/}
                    {/*        placeholder="Поиск по филиалу..."*/}
                    {/*    />*/}
                    {/*    */}
                    {/*    {showButtonClear && (*/}
                    {/*        <button id="CleanButton" onClick={handleClearSearch} className='cleanInputSvg'>*/}
                    {/*            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="17" height="17" viewBox="0 0 50 50">*/}
                    {/*                <path d="M 40.783203 7.2714844 A 2.0002 2.0002 0 0 0 39.386719 7.8867188 L 25.050781 22.222656 L 10.714844 7.8867188 A 2.0002 2.0002 0 0 0 9.2792969 7.2792969 A 2.0002 2.0002 0 0 0 7.8867188 10.714844 L 22.222656 25.050781 L 7.8867188 39.386719 A 2.0002 2.0002 0 1 0 10.714844 42.214844 L 25.050781 27.878906 L 39.386719 42.214844 A 2.0002 2.0002 0 1 0 42.214844 39.386719 L 27.878906 25.050781 L 42.214844 10.714844 A 2.0002 2.0002 0 0 0 40.783203 7.2714844 z"></path>*/}
                    {/*            </svg>*/}
                    {/*        </button>*/}
                    {/*    )}*/}
                    {/*</div>*/}
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
                                    <tr ref={refs.id} key={order.id}>
                                        <td ref={refs.address} >{order.address}</td>
                                        <td ref={refs.nickname} >{order.nickname}</td>
                                        <td ref={refs.dateOrder} >{order.dateOrder}</td>
                                        <td ref={refs.phone} >{order.phone}</td>
                                        <td ref={refs.frontDoorQuantity} >{order.frontDoorQuantity}</td>
                                        <td ref={refs.inDoorQuantity} >{order.inDoorQuantity}</td>
                                        <td ref={refs.messageSeller} >{order.messageSeller}</td>
                                        <td><input ref={refs.message} type="text"/></td>
                                        <td>
                                            <select ref={refs.installer}
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
                                                <button onClick={postData} disabled={!selectedTag[order.id]} id="ConfirmBtn">Подтвердить</button>
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
