import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'pikaday/css/pikaday.css';
import '../../../styles/stylePages/PatchOrderPage.css';
import {CustomCalendar} from "../../special/CustomCalendar.jsx";

export const PatchOrderPage = () => {
    const { orderId } = useParams();
    const [inputValue, setInputValue] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const availabilityList = /*[[${availabilityList}]]*/ [];
    const navigate = useNavigate();
    const calendarRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target) && !refs.dateRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelected = (dateStr) => {
        setSelectedDate(dateStr);
        setInputValue(prev => ({ ...prev, dateOrder: dateStr }));
        setIsCalendarOpen(false);
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

            navigate('/home/seller/listOrdersSeller/');
        } catch (err) {
            console.error('PATCH Error:', err.message);
        }
    };

    return (
        <div className="sellerCreatePage">
            <form onSubmit={handleSubmit} className="form-container">
                <h1>Заполните данные о заказе</h1>
                <h3 className="subtitleInput">Укажите данные заказчика</h3>
                <div className="sellerCreatePage_elements">
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
                        <label htmlFor="dateOrdered">Дата доставки: </label>
                        <input
                            required
                            className="input_SellerPage"
                            type="text"
                            id="dateOrdered"
                            ref={refs.dateRef}
                            placeholder="Выбрать дату"
                            value={inputValue.dateOrder || ''}
                            onClick={() => setIsCalendarOpen(prev => !prev)}
                            readOnly
                        />
                        {isCalendarOpen && (
                            <div ref={calendarRef} className="calendar-container">
                                <CustomCalendar
                                    availabilityList={availabilityList}
                                    onDateSelected={handleDateSelected}
                                    selectedDate={selectedDate}
                                />
                            </div>
                        )}
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

                    <div className="buttons-group">
                        <button type="button" className="submit-btn" onClick={() => navigate('/home/seller/listOrdersSeller/')}>Отмена</button>
                        <button id="submitButton" type="submit" className="submit-btn">Подтвердить</button>
                    </div>
                </div>
            </form>
        </div>
    );
};