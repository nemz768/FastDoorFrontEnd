import React, {useEffect, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import Pikaday from "pikaday";

export const PatchOrderPage = () => {

    const availabilityData = /*[[${availabilityList}]]*/ [];
    const availabilityMap = {};
    availabilityData.forEach(day => {
        availabilityMap[day.date] = day.frontDoorQuantity;
    });
    const navigate = useNavigate();


    const [getOrdersToChange, setOrdersToChange] = useState([]);
    const URL = `/api/edit/${getOrdersToChange.id}};













    const numbers = '1234567890';
    // const [getOrderById, setGetOrderById] = useState(null);
    const getOrderById = 0;

    const refs = {
        frontDoorRef: useRef(null),
        inDoorRef: useRef(null),
    };

    const sendResultsCreate = async (e) => {
        e.preventDefault();
        console.log(refs.fullname.current.value);

        await fetch(`/api/edit/${getOrderById.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((res) => {
                res.json();
            })
            .then((data) => {
                console.log('Server response: ', data);
                navigate("../");
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        const frontInput = refs.frontDoorRef.current;
        const inInput = refs.inDoorRef.current;

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

    return (
        <div className="sellerCreatePage">
            <form onSubmit={(e) => {
                sendResultsCreate(e);
            }} className="form-container">
                <h1>Заполните данные о заказе</h1>
                <h3 className='subtitleInput'>Укажите данные заказчика</h3>

                <div className="input-group">
                    <label htmlFor="fullName">ФИО: </label>
                    <input
                        type="text"
                        className="input_SellerPage"
                        id="fullName"
                        required
                        ref={refs.fullname}
                        placeholder="ФИО"
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
                    />
                </div>

                <h3 className='subtitleInput'>Укажите прочие данные</h3>

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

                <button id="submitButton" type="submit" className="submit-btn">Подтвердить заказ</button>
            </form>
        </div>
    );
};