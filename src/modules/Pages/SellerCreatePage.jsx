import React, { useEffect, useRef } from 'react';
import '../../styles/stylePages/createSellerPage.css';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';

export const SellerCreatePage = () => {
    const availabilityData = /*[[${availabilityList}]]*/ [];
    const availabilityMap = {};
    availabilityData.forEach(day => {
        availabilityMap[day.date] = day.frontDoorQuantity;
    });

    const frontDoorRef = useRef(null);
    const inDoorRef = useRef(null);
    const dateRef = useRef(null);
    const numbers = '1234567890';

    useEffect(() => {
        const frontInput = frontDoorRef.current;
        const inInput = inDoorRef.current;

        const handleInput = (el) => {
            const inputArray = el.value.split('');
            const currentVal = el.value;
            const onlyNumbers = inputArray.every(char => numbers.includes(char));
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
        if (dateRef.current) {
                 new Pikaday({
                field: dateRef.current,
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
                onSelect: function(date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    dateRef.current.value = `${year}-${month}-${day}`;
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
                            dayElement.innerHTML += `<br><small>${availableDoors} дв.</small>`;
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

    return (
        <div className="sellerCreatePage">
            <form method="POST" className="form-container">
                <h1>Заполните данные о заказе</h1>
                <h3 className='subtitleInput'>Укажите данные заказчика</h3>

                <div className="input-group">
                    <label htmlFor="fullName">ФИО: </label>
                    <input type="text" id="fullName" required />
                </div>

                <div className="input-group">
                    <label htmlFor="address">Адрес: </label>
                    <input type="text" id="address" required />
                </div>

                <div className="input-group">
                    <label htmlFor="phoneDelivery">Номер телефона: </label>
                    <input type="text" id="phoneDelivery" required />
                </div>

                <div className="input-group">
                    <label htmlFor="messageSeller">Комментарий: </label>
                    <input type="text" id="messageSeller" required />
                </div>

                <h3 className='subtitleInput'>Укажите прочие данные</h3>

                <div className="input-group">
                    <label htmlFor="dateOrdered">Дата доставки: </label>
                    <input readOnly required type="text" id="dateOrdered" ref={dateRef} placeholder="Выбрать дату" />
                </div>

                <div className="input-group">
                    <label htmlFor="frontDoorQuantity">Количество входных дверей</label>
                    <input type="text" id="frontDoorQuantity" ref={frontDoorRef} required />
                </div>

                <div className="input-group">
                    <label htmlFor="inDoorQuantity">Количество межкомнатных дверей</label>
                    <input type="text" id="inDoorQuantity" ref={inDoorRef} required />
                </div>

                <button id="submitButton" type="submit" className="submit-btn">Подтвердить заказ</button>
            </form>
        </div>
    );
};
