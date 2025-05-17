import React, {useEffect, useRef, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';

export const PatchOrderPage = () => {

    const {orderId} = useParams();
    const [inputValue, setInputValue] = useState('');

    const availabilityData = /*[[${availabilityList}]]*/ [];
    const availabilityMap = {};
    availabilityData.forEach(day => {
        availabilityMap[day.date] = day.frontDoorQuantity;
    });
    const navigate = useNavigate();

    const refs = {
        fullname: useRef(null),
        address: useRef(null),
        phone: useRef(null),
        comments: useRef(null),
        dateRef: useRef(null),
        frontDoorRef: useRef(null),
        inDoorRef: useRef(null),
    };

    useEffect(() => {
        const getData = async () => {

            try {
                const response = await fetch(`/api/edit/${orderId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json();
                console.log(data);
                console.log(data.orderAttribute.fullName);

                setInputValue({
                    ...data.orderAttribute,
                    fullName: data.orderAttribute.fullName,
                    address: data.orderAttribute.address,
                    phone: data.orderAttribute.phone,
                    messageSeller: data.orderAttribute.messageSeller,
                    dateOrder: data.orderAttribute.dateOrder,
                    frontDoorQuantity: data.orderAttribute.frontDoorQuantity,
                    inDoorQuantity: data.orderAttribute.inDoorQuantity,
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `PATCH request failed: ${response.status}`);
                }

            }

            catch (err) {
                console.log(err);
            }
        }
        getData();
    }, [])


    useEffect(() => {
        const handleInput = (el) => {
            const value = el.value;
            if (!/^\d*$/.test(value) || (value.startsWith('0') && value.length > 1)) {
                el.value = value.slice(0, -1);
            }
            setInputValue(prev => ({ ...prev, [el.id]: el.value }));
        };

        const frontInput = refs.frontDoorRef.current;
        const inInput = refs.inDoorRef.current;
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
        if (refs.dateRef.current) {
            new Pikaday({
                field: refs.dateRef.current,
                format: "YYYY-MM-DD",
                firstDay: 1,
                minDate: new Date(2024, 0, 1),
                maxDate: new Date(2025, 11, 31),
                yearRange: [2023, 2030],
                i18n: {
                    previousMonth: "Предыдущий",
                    nextMonth: "Следующий",
                    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                    weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
                    weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
                },
                onSelect: function (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    refs.dateRef.current.value = `${year}-${month}-${day}`;
                },
                onDraw: function () {
                    const days = document.querySelectorAll('.pika-day');

                    days.forEach(dayElement => {
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
                }
            });
        }
    }, [availabilityMap]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orderId) {
            console.error('Error: orderId is undefined');
            return;
        }

        const fullName = refs.fullname.current.value;
        const address = refs.address.current.value;
        const phone = refs.phone.current.value;
        const messageSeller = refs.messageSeller.current.value;
        const dateOrder = refs.dateRef.current.value;
        const frontDoorRef = refs.frontDoorRef.current.value;
        const inDoorRef = refs.frontDoorRef.current.value;

        const payload = { fullName, address, phone, messageSeller, dateOrder, frontDoorRef, inDoorRef };

        console.log('Sending PATCH request:', { orderId, payload });

        try {
            const response = await fetch(`/api/edit/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.warn('Failed to parse error response:', jsonError);
                }
                throw new Error(errorMessage);
            }

            navigate('/orders');
        } catch (err) {
            console.error('PATCH Error:', err.message);
            // Optionally display error to user (e.g., show a toast notification)
        }
    };
    return (
        <div className="sellerCreatePage">
            <form onSubmit={handleSubmit}  className="form-container">
                <h1>Заполните данные о заказе</h1>
                <h3 className='subtitleInput'>Укажите данные заказчика</h3>
                <div>
                    <div className="input-group">
                        <label htmlFor="fullName">ФИО: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="fullName"
                            required
                            ref={refs.fullname}
                            placeholder="ФИО"
                            defaultValue={inputValue.fullName}
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
                            defaultValue={inputValue.address}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="phoneDelivery">Номер телефона: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="phoneDelivery"
                            required
                            ref={refs.phone}
                            placeholder="Номер телефона"
                            defaultValue={inputValue.phone}

                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="messageSeller">Комментарий: </label>
                        <input
                            type="text"
                            className="input_SellerPage"
                            id="messageSeller"
                            required
                            ref={refs.comments}
                            placeholder="Комментарий"
                            defaultValue={inputValue.messageSeller}
                        />
                    </div>

                    <h3 className='subtitleInput'>Укажите прочие данные</h3>

                    <div className="input-group">
                        <label htmlFor="dateOrdered">Дата доставки: </label>
                        <input
                           required
                            className="input_SellerPage"
                            type="text"
                            id="dateOrdered"
                            ref={refs.dateRef}
                            placeholder="Выбрать дату"
                            defaultValue={inputValue.dateOrder}
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
                            defaultValue={inputValue.frontDoorQuantity}
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
                            defaultValue={inputValue.inDoorQuantity}

                        />
                    </div>
                    <button onClick={()=> navigate(-1)}>Отмена</button>
                    <button id="submitButton" type="submit" className="submit-btn">Подтвердить</button>
                </div>
            </form>

        </div>
    );
};