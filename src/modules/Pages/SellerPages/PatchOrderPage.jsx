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
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phone: '',
        messageSeller: '',
        dateOrder: '',
        frontDoorQuantity: '',
        inDoorQuantity: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const refs = {
        dateRef: useRef(null),
        frontDoorRef: useRef(null),
        inDoorRef: useRef(null),
    };

    const getApi = async () => {
        if (!orderId) {
            setError('ID заказа не указан');
            navigate('/home/seller/listOrdersSeller');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/edit/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setFormData({
                fullName: data.fullName || '',
                address: data.address || '',
                phone: data.phone || '',
                messageSeller: data.messageSeller || '',
                dateOrder: data.dateOrder || '',
                frontDoorQuantity: data.frontDoorQuantity || '',
                inDoorQuantity: data.inDoorQuantity || '',
            });
            console.log('Данные с сервера:', data);
        } catch (err) {
            console.error('Ошибка при загрузке данных:', err.message);
            setError('Не удалось загрузить данные заказа');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/edit/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Данные успешно обновлены:', data);
            navigate('/home/seller/listOrdersSeller');
        } catch (err) {
            console.error('Ошибка при обновлении:', err.message);
            setError('Не удалось обновить заказ');
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    useEffect(() => {
        getApi();
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
                setFormData((prev) => ({ ...prev, [el.id]: el.value }));
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
            const picker = new Pikaday({
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
                    const formattedDate = `${year}-${month}-${day}`;
                    refs.dateRef.current.value = formattedDate;
                    setFormData((prev) => ({ ...prev, dateOrder: formattedDate }));
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

            // Set initial date if available
            if (formData.dateOrder) {
                picker.setDate(formData.dateOrder);
            }
        }
    }, [availabilityMap, formData.dateOrder]);

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    return (
        <div className="sellerCreatePage">
            <form className="form-container" onSubmit={handleSubmit}>
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
                        value={formData.fullName}
                        onChange={handleInputChange}
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
                        value={formData.address}
                        onChange={handleInputChange}
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
                        value={formData.phone}
                        onChange={handleInputChange}
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
                        value={formData.messageSeller}
                        onChange={handleInputChange}
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
                        value={formData.dateOrder}
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
                        value={formData.frontDoorQuantity}
                        onChange={handleInputChange}
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
                        value={formData.inDoorQuantity}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Подтвердить
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/home/seller/listOrdersSeller')}
                    className="submit-btn"
                >
                    Отмена
                </button>
            </form>
        </div>
    );
};