import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';



export const PatchOrderPage = () => {
    const { orderId } = useParams();
    const availabilityData = /*[[${availabilityList}]]*/ [];
    const availabilityMap = {};
    availabilityData.forEach((day) => {
        availabilityMap[day.date] = day.frontDoorQuantity;
    });
    const navigate = useNavigate();
    const numbers = '1234567890';
    const [error, setError] = useState(null);
    const [getOrderById, setGetOrderById] = useState(null);

    const refs = {
        dateRef: useRef(null),
        frontDoorRef: useRef(null),
        inDoorRef: useRef(null),
    };

    const getApi = async () => {
        console.log('Fetching data for orderId:', orderId);
        try {
            const response = await fetch(`/api/edit/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
            }
            const data = await response.json();
            console.log('API data:', data);
            setGetOrderById(data);
            setError(null);
        } catch (err) {
            console.error('API error:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        console.log('orderId:', orderId);
        if (orderId) {
            getApi();
        }
    }, [orderId]);

    useEffect(() => {
        const frontInput = refs.frontDoorRef.current;
        const inInput = refs.inDoorRef.current;

        const handleInput = (el) => {
            const inputArray = el.value.split('');
            const currentVal = el.value;
            const onlyNumbers = inputArray.every((char) => numbers.includes(char));
            if (!onlyNumbers || (currentVal.startsWith('0') && currentVal.length > 1)) {
                el.value = currentVal.slice(0, -1);
            }
        };
        frontInput.addEventListener('input', () => handleInput(frontInput));
        inInput.addEventListener('input', () => handleInput(inInput));

        return () => {
            frontInput.removeEventListener('input', () => handleInput(frontInput));
            inInput.removeEventListener('input', () => handleInput(inInput));
        };
    }, []);

    useEffect(() => {
        if (refs.dateRef.current) {
            new Pikaday({
                field: refs.dateRef.current,
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
                    refs.dateRef.current.value = `${year}-${month}-${day}`;
                },
                onDraw: function () {
                    const days = document.querySelectorAll('.pika-day');
                    days.forEach((dayElement) => {
                        const year = dayElement.getAttribute('data-pika-year');
                        const month = String(
                            Number(dayElement.getAttribute('data-pika-month')) + 1
                        ).padStart(2, '0');
                        const day = String(dayElement.getAttribute('data-pika-day')).padStart(
                            2,
                            '0'
                        );
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


    const HandleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            fullName: e.target.fullName.value,
            address: e.target.address.value,
            phoneDelivery: e.target.phoneDelivery.value,
            messageSeller: e.target.messageSeller.value,
            dateOrdered: refs.dateRef.current.value,
            frontDoorQuantity: refs.frontDoorRef.current.value,
            inDoorQuantity: refs.inDoorRef.current.value,
        };

        try {
            const response = await fetch(`/api/edit/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
            }


           const data = await response.json();
            console.log('Заказ обновлен:', data);
            navigate(-1);
        }catch(err) {
            setError(err.message);
            console.log(err.message);
        }
    }

    return (
        <div className="sellerCreatePage">
            <div>
                <h2>Отладка данных:</h2>
                <pre>{JSON.stringify(getOrderById, null, 2)}</pre>
            </div>
            {!error && (
                <form className="form-container" onSubmit={(e)=> HandleSubmit(e)}>
                    <h1>Заполните данные о заказе</h1>
                    <h3 className="subtitleInput">Укажите данные заказчика</h3>

                    <div className="input-group">
                        <label htmlFor="fullName">ФИО: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="fullName"
                            required
                            placeholder="ФИО"
                           defaultvalue={getOrderById?.fullName || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="address">Адрес: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="address"
                            required
                            placeholder="Адрес"
                            defaultvalue={getOrderById?.address || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="phoneDelivery">Номер телефона: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="phoneDelivery"
                            required
                            placeholder="Номер телефона"
                            defaultValue={getOrderById?.phoneDelivery || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="messageSeller">Комментарий: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="messageSeller"
                            required
                            placeholder="Комментарий"
                            defaultValue={getOrderById?.messageSeller || ''}
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
                            ref={refs.dateRef}
                            placeholder="Выбрать дату"
                            defaultValue={getOrderById?.dateOrdered || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="frontDoorQuantity">Количество входных дверей</label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="frontDoorQuantity"
                            ref={refs.frontDoorRef}
                            required
                            placeholder="Количество входных дверей"
                            defaultValue={getOrderById?.frontDoorQuantity || ''}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="inDoorQuantity">Количество межкомнатных дверей</label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="inDoorQuantity"
                            ref={refs.inDoorRef}
                            required
                            placeholder="Количество межк-х дверей"
                            defaultValue={getOrderById?.inDoorQuantity || ''}
                        />
                    </div>

                    <button id="submitButton" type="submit" className="submit-btn">
                        Подтвердить
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="submit-btn"
                    >
                        Отмена
                    </button>
                </form>
            )}
        </div>
    );
};