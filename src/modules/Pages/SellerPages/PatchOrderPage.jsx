import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';

export const PatchOrderPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const numbers = '1234567890';
    const [getOrderById, setGetOrderById] = useState(null);
    const [availabilityData, setAvailabilityData] = useState([]); // Загрузка данных

    const refs = {
        dateRef: useRef(null),
        frontDoorRef: useRef(null),
        inDoorRef: useRef(null),
        fullNameRef: useRef(null),
        addressRef: useRef(null),
        phoneRef: useRef(null),
        messageSellerRef: useRef(null),
    };

    // Загрузка данных о доступности
    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await fetch('/api/availability'); // Замените на ваш API
                const data = await response.json();
                setAvailabilityData(data);
            } catch (err) {
                console.error("Ошибка при загрузке доступности:", err.message);
            }
        };
        fetchAvailability();
    }, []);

    const availabilityMap = useMemo(() => {
        const map = {};
        availabilityData.forEach((day) => {
            map[day.date] = day.frontDoorQuantity;
        });
        return map;
    }, [availabilityData]);

    const getApi = async () => {
        try {
            const response = await fetch(`/api/edit/${orderId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setGetOrderById(data);
        } catch (err) {
            console.error("Ошибка при загрузке данных:", err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/edit/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: refs.fullNameRef.current.value,
                    address: refs.addressRef.current.value,
                    phone: refs.phoneRef.current.value,
                    messageSeller: refs.messageSellerRef.current.value,
                    dateOrder: refs.dateRef.current.value,
                    frontDoorQuantity: refs.frontDoorRef.current.value,
                    inDoorQuantity: refs.inDoorRef.current.value,
                }),
            });
            const data = await response.json();
            navigate(-1);
        } catch (err) {
            console.error("Ошибка при обновлении:", err.message);
        }
    };

    useEffect(() => {
        getApi();
    }, []);

    useEffect(() => {
        if (getOrderById) {
            refs.fullNameRef.current.value = getOrderById.fullName || '';
            refs.addressRef.current.value = getOrderById.address || '';
            refs.phoneRef.current.value = getOrderById.phone || '';
            refs.messageSellerRef.current.value = getOrderById.messageSeller || '';
            refs.dateRef.current.value = getOrderById.dateOrder || '';
            refs.frontDoorRef.current.value = getOrderById.frontDoorQuantity || '';
            refs.inDoorRef.current.value = getOrderById.inDoorQuantity || '';
        }
    }, [getOrderById]);

    useEffect(() => {
        const frontInput = refs.frontDoorRef.current;
        const inInput = refs.inDoorRef.current;

        const handleInput = (el) => {
            const value = el.value;
            if (!/^\d*$/.test(value) || value.startsWith('0') || Number(value) > 100) {
                el.value = value.slice(0, -1);
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
        let picker;
        if (refs.dateRef.current) {
            picker = new Pikaday({
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
                        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
                    ],
                    weekdays: [
                        'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
                        'Четверг', 'Пятница', 'Суббота',
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

            if (getOrderById?.dateOrder) {
                refs.dateRef.current.value = getOrderById.dateOrder;
            }
        }

        return () => {
            if (picker) {
                picker.destroy();
            }
        };
    }, [availabilityMap, getOrderById]);

    return (
        <div className="sellerCreatePage">
            <form className="form-container">
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
                        ref={refs.fullNameRef}
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
                        ref={refs.addressRef}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="phone">Номер телефона: </label>
                    <input
                        type="text"
                        className="input_SellerPage"
                        id="phone"
                        required
                        placeholder="Номер телефона"
                        ref={refs.phoneRef}
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
                        ref={refs.messageSellerRef}
                    />
                </div>

                <h3 className="subtitleInput">Укажите прочие данные</h3>

                <div className="input-group">
                    <label htmlFor="dateOrder">Дата доставки: </label>
                    <input
                        readOnly
                        required
                        className="input_SellerPage"
                        type="text"
                        id="dateOrder"
                        ref={refs.dateRef}
                        placeholder="Выбрать дату"
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
                    />
                </div>

                <button id="submitButton" onClick={handleSubmit} className="submit-btn">
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
        </div>
    );
};