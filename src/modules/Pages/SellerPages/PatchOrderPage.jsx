import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'pikaday/css/pikaday.css';
import '../../../styles/stylePages/PatchOrderPage.css'; // Assuming you'll add CSS for styling

const CustomCalendar = ({ availabilityData, onDateSelected, selectedDate }) => {
    const today = new Date();
    const [currentYearMonth, setCurrentYearMonth] = useState({
        year: today.getFullYear(),
        month: today.getMonth(),
    });

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const daysInMonth = new Date(currentYearMonth.year, currentYearMonth.month + 1, 0).getDate();
    const firstDayOfWeek = (new Date(currentYearMonth.year, currentYearMonth.month, 1).getDay() || 7) % 7;

    const availabilityMap = {};
    availabilityData.forEach(day => {
        availabilityMap[day.date] = {
            frontDoorQuantity: day.frontDoorQuantity,
            inDoorQuantity: day.inDoorQuantity,
        };
    });

    const handlePrevMonth = () => {
        setCurrentYearMonth(prev => ({
            year: prev.month === 0 ? prev.year - 1 : prev.year,
            month: prev.month === 0 ? 11 : prev.month - 1,
        }));
    };

    const handleNextMonth = () => {
        setCurrentYearMonth(prev => ({
            year: prev.month === 11 ? prev.year + 1 : prev.year,
            month: prev.month === 11 ? 0 : prev.month + 1,
        }));
    };

    const renderDays = () => {
        const weeks = Math.ceil((firstDayOfWeek + daysInMonth) / 7);
        const days = [];
        let day = 1;

        for (let week = 0; week < weeks; week++) {
            const weekDays = [];
            for (let dow = 0; dow < 7; dow++) {
                const index = week * 7 + dow;
                if (index < firstDayOfWeek || day > daysInMonth) {
                    weekDays.push(<div key={`empty-${index}`} className="calendar-day empty" />);
                } else {
                    const date = new Date(currentYearMonth.year, currentYearMonth.month, day);
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateStr;
                    const availability = availabilityMap[dateStr];

                    weekDays.push(
                        <div
                            key={dateStr}
                            className={`calendar-day ${isSelected ? 'selected' : ''}`}
                            onClick={() => onDateSelected(dateStr)}
                        >
                            <div>{day}</div>
                            {availability && (
                                <div className="availability">
                                    <span>В: {availability.frontDoorQuantity}</span>
                                    <span>М: {availability.inDoorQuantity}</span>
                                </div>
                            )}
                        </div>
                    );
                    day++;
                }
            }
            days.push(<div key={`week-${week}`} className="calendar-week">{weekDays}</div>);
        }
        return days;
    };

    return (
        <div className="custom-calendar">
            <div className="calendar-header">
                <span onClick={handlePrevMonth} className="nav-arrow">{'<'}</span>
                <span>{`${monthNames[currentYearMonth.month]} ${currentYearMonth.year}`}</span>
                <span onClick={handleNextMonth} className="nav-arrow">{'>'}</span>
            </div>
            <div className="calendar-weekdays">
                {dayNames.map((day, index) => (
                    <div key={index} className="weekday">{day}</div>
                ))}
            </div>
            <div className="calendar-days">{renderDays()}</div>
        </div>
    );
};

export const PatchOrderPage = () => {
    const { orderId } = useParams();
    const [inputValue, setInputValue] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);

    const availabilityData = /*[[${availabilityList}]]*/ [];
    const navigate = useNavigate();

    const refs = {
        fullname: useRef(null),
        address: useRef(null),
        phone: useRef(null),
        comments: useRef(null),
        frontDoorRef: useRef(null),
        inDoorRef: useRef(null),
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`/api/edit/${orderId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                setInputValue({
                    fullName: data.orderAttribute.fullName,
                    address: data.orderAttribute.address,
                    phone: data.orderAttribute.phone,
                    messageSeller: data.orderAttribute.messageSeller,
                    dateOrder: data.orderAttribute.dateOrder,
                    frontDoorQuantity: data.orderAttribute.frontDoorQuantity,
                    inDoorQuantity: data.orderAttribute.inDoorQuantity,
                });
                setSelectedDate(data.orderAttribute.dateOrder);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `PATCH request failed: ${response.status}`);
                }
            } catch (err) {
                console.log(err);
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

    const handleDateSelected = (dateStr) => {
        setSelectedDate(dateStr);
        setInputValue(prev => ({ ...prev, dateOrder: dateStr }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orderId) {
            console.error('Error: orderId is undefined');
            return;
        }

        const fullName = refs.fullname.current?.value || '';
        const address = refs.address.current?.value || '';
        const phone = refs.phone.current?.value || '';
        const messageSeller = refs.comments.current?.value || '';
        const dateOrder = selectedDate || '';
        const frontDoorQuantity = Number(refs.frontDoorRef.current?.value) || 0;
        const inDoorQuantity = Number(refs.inDoorRef.current?.value) || 0;

        const payload = {
            fullName,
            address,
            phone,
            messageSeller,
            dateOrder,
            frontDoorQuantity,
            inDoorQuantity,
        };

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

            navigate(-1);
        } catch (err) {
            console.error('PATCH Error:', err.message);
        }
    };

    return (
        <div className="sellerCreatePage">
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

                    <h3 className="subtitleInput">Укажите прочие данные</h3>

                    <div className="input-group">
                        <label>Дата доставки: </label>
                        <CustomCalendar
                            availabilityData={availabilityData}
                            onDateSelected={handleDateSelected}
                            selectedDate={selectedDate}
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
                    <button type="button" onClick={() => navigate(-1)}>Отмена</button>
                    <button id="submitButton" type="submit" className="submit-btn">Подтвердить</button>
                </div>
            </form>
        </div>
    );
};