import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';

export const PatchOrderPage = () => {
    const { orderId } = useParams();
    const [inputValue, setInputValue] = useState({});
    const [error, setError] = useState(null);
    const availabilityData = /*[[${availabilityList}]]*/ [];
    const availabilityMap = {};
    availabilityData.forEach((day) => {
        availabilityMap[day.date] = day.frontDoorQuantity;
    });
    const navigate = useNavigate();

    const refs = {
        fullName: useRef(null), // Match input id="fullName"
        address: useRef(null),
        phoneDelivery: useRef(null), // Match input id="phoneDelivery"
        messageSeller: useRef(null), // Match input id="messageSeller"
        dateOrder: useRef(null), // Match input id="dateOrdered"
        frontDoorQuantity: useRef(null), // Match input id="frontDoorQuantity"
        inDoorQuantity: useRef(null), // Match input id="inDoorQuantity"
    };

    useEffect(() => {
        const getData = async () => {
            if (!orderId || orderId === 'undefined') {
                setError('Неверный ID заказа');
                return;
            }
            try {
                const response = await fetch(`/api/edit/${orderId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    const errorData = await response.text(); // Use text to handle non-JSON errors
                    throw new Error(`Ошибка HTTP! Статус: ${response.status}, Сообщение: ${errorData}`);
                }
                const data = await response.json();
                console.log('API data:', data);
                console.log('fullName:', data.orderAttribute.fullName);

                setInputValue({
                    fullName: data.orderAttribute.fullName,
                    address: data.orderAttribute.address,
                    phone: data.orderAttribute.phone,
                    messageSeller: data.orderAttribute.messageSeller,
                    dateOrder: data.orderAttribute.dateOrder,
                    frontDoorQuantity: data.orderAttribute.frontDoorQuantity,
                    inDoorQuantity: data.orderAttribute.inDoorQuantity,
                });
            } catch (err) {
                console.error('GET error:', err.message);
                setError(err.message);
            }
        };
        getData();
    }, [orderId]);

    useEffect(() => {
        const handleInput = (el) => {
            const value = el.value;
            if (!/^\d*$/.test(value) || (value.startsWith('0') && value.length > 1)) {
                el.value = value.slice(0, -1);
            }
            setInputValue((prev) => ({ ...prev, [el.id]: el.value }));
        };

        const frontInput = refs.frontDoorQuantity.current;
        const inInput = refs.inDoorQuantity.current;
        if (frontInput && inInput) {
            frontInput.addEventListener('input', () => handleInput(frontInput));
            inInput.addEventListener('input', () => handleInput(inInput));
        }

        return () => {
            if (frontInput) frontInput.removeEventListener('input', () => handleInput(frontInput));
            if (inInput) inInput.removeEventListener('input', () => handleInput(inInput));
        };
    }, []);

    useEffect(() => {
        if (refs.dateOrder.current) {
            new Pikaday({
                field: refs.dateOrder.current,
                format: 'YYYY-MM-DD',
                firstDay: 1,
                minDate: new Date(2024, 0, 1),
                maxDate: new Date(2025, 11, 31),
                yearRange: [2023, 2030],
                i18n: {
                    previousMonth: 'Предыдущий',
                    nextMonth: 'Следующий',
                    months: [
                        'Январь',
                        'Февраль',
                        'Март',
                        'Апрель',
                        'Май',
                        'Июнь',
                        'Июль',
                        'Август',
                        'Сентябрь',
                        'Октябрь',
                        'Ноябрь',
                        'Декабрь',
                    ],
                    weekdays: [
                        'Воскресенье',
                        'Понедельник',
                        'Вторник',
                        'Среда',
                        'Четверг',
                        'Пятница',
                        'Суббота',
                    ],
                    weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                },
                onSelect: function (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    refs.dateOrder.current.value = `${year}-${month}-${day}`;
                    setInputValue((prev) => ({ ...prev, dateOrder: refs.dateOrder.current.value }));
                },
                onDraw: function () {
                    const days = document.querySelectorAll('.pika-day');
                    days.forEach((dayElement) => {
                        const year = dayElement.getAttribute('data-pika-year');
                        const month = String(Number(dayElement.getAttribute('data-pika-month')) + 1).padStart(2, '0');
                        const day = String(dayElement.getAttribute('data-pika-day')).padStart(2, '0');
                        const dateStr = `${year}-${month}-${day}`;
                        if (availabilityMap[dateStr] !== undefined) {
                            const availableDoors = availabilityMap[dateStr];
                            dayElement.setAttribute('title', `${availableDoors} дверей доступно`);
                        } else {
                            dayElement.removeAttribute('title');
                        }
                    });
                },
                disableDayFn: function (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    return availabilityMap[dateStr] === 0;
                },
            });
        }
    }, [availabilityMap]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!orderId || orderId === 'undefined') {
            setError('ID заказа не указан');
            return;
        }

        const payload = {
            fullName: refs.fullName.current.value,
            address: refs.address.current.value,
            phone: refs.phoneDelivery.current.value,
            messageSeller: refs.messageSeller.current.value,
            dateOrder: refs.dateOrder.current.value,
            frontDoorQuantity: refs.frontDoorQuantity.current.value || '0',
            inDoorQuantity: refs.inDoorQuantity.current.value || '0',
        };
        console.log('PATCH payload:', payload);

        try {
            const response = await fetch(`/api/edit/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderAttribute: payload }), // Match GET response structure
            });

            if (!response.ok) {
                const errorData = await response.text(); // Use text to handle non-JSON errors
                throw new Error(`Ошибка HTTP! Статус: ${response.status}, Сообщение: ${errorData}`);
            }

            const data = await response.json();
            console.log('PATCH success:', data);
            navigate(-1); // Redirect to previous page
        } catch (err) {
            console.error('PATCH error:', err.message);
            setError(err.message);
        }
    };

    return (
        <div className="sellerCreatePage">
            {error && (
                <div className="error-message">
                    <p>Ошибка: {error}</p>
                    <button onClick={() => navigate(-1)} className="submit-btn">
                        Назад
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="form-container">
                <h1>Заполните данные о заказе</h1>
                <h3 className="subtitleInput">Укажите данные заказчика</h3>
                <div>
                    <div className="input-group">
                        <label htmlFor="fullName">ФИО: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="fullName"
                            required
                            ref={refs.fullName}
                            placeholder="ФИО"
                            defaultValue={inputValue.fullName || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="address">Адрес: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="address"
                            required
                            ref={refs.address}
                            placeholder="Адрес"
                            defaultValue={inputValue.address || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="phoneDelivery">Номер телефона: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="phoneDelivery"
                            required
                            ref={refs.phoneDelivery}
                            placeholder="Номер телефона"
                            defaultValue={inputValue.phone || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="messageSeller">Комментарий: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="messageSeller"
                            required
                            ref={refs.messageSeller}
                            placeholder="Комментарий"
                            defaultValue={inputValue.messageSeller || ''}
                        />
                    </div>

                    <h3 className="subtitleInput">Укажите прочие данные</h3>

                    <div className="input-group">
                        <label htmlFor="dateOrdered">Дата доставки: </label>
                        <input
                            readOnly
                            required
                            className="input_SellerPage"
                            type="text"
                            id="dateOrdered"
                            ref={refs.dateOrder}
                            placeholder="Выбрать дату"
                            defaultValue={inputValue.dateOrder || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="frontDoorQuantity">Количество входных дверей</label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="frontDoorQuantity"
                            ref={refs.frontDoorQuantity}
                            required
                            placeholder="Количество входных дверей"
                            defaultValue={inputValue.frontDoorQuantity || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="inDoorQuantity">Количество межкомнатных дверей</label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="inDoorQuantity"
                            ref={refs.inDoorQuantity}
                            required
                            placeholder="Количество межк-х дверей"
                            defaultValue={inputValue.inDoorQuantity || ''}
                        />
                    </div>
                    <button type="button" onClick={() => navigate(-1)} className="submit-btn">
                        Отмена
                    </button>
                    <button id="submitButton" type="submit" className="submit-btn">
                        Подтвердить
                    </button>
                </div>
            </form>
        </div>
    );
};