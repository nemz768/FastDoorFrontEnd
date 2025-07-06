import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './createSellerPage.css';
import { CustomCalendar } from "../../../Widgets/CustomCalendar/CustomCalendar";
import { Availability } from '../../../Interfaces/Interfaces';


export const SellerCreatePage = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const availabilityList: Availability[] = /*[[${availabilityList}]]*/ [];
    const [fetchedAvailability, setFetchedAvailability] = useState(availabilityList || []);
    const calendarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const numbers = '1234567890';

    const refs = {
        fullname: useRef<HTMLInputElement>(null),
        address: useRef<HTMLInputElement>(null),
        phone: useRef<HTMLInputElement>(null),
        comments: useRef<HTMLInputElement>(null),
        dateRef: useRef<HTMLInputElement>(null),
        frontDoorRef: useRef<HTMLInputElement>(null),
        inDoorRef: useRef<HTMLInputElement>(null),
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                calendarRef.current &&
                refs.dateRef.current &&
                !calendarRef.current.contains(target) &&
                !refs.dateRef.current.contains(target)
            ) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(() => {
        const showCountOfDoors = async () => {
            try {
                const res = await fetch("/api/orders/create", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                const availabilityData = Array.isArray(data.availabilityList) ? data.availabilityList : [];
                setFetchedAvailability(availabilityData);
                console.log("Fetched availability:", availabilityData);
            } catch (err) {
                console.error("Error fetching availability:", err);
                setFetchedAvailability(availabilityList || []);
            }
        };
        showCountOfDoors();
    }, []);



    const sendResultsCreate = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fullname = refs.fullname.current?.value || '';
        const address = refs.address.current?.value || '';
        const phone = refs.phone.current?.value || '';
        const comments = refs.comments.current?.value || '';
        const dateOrder = selectedDate || null;
        const frontDoorQuantity = Number(refs.frontDoorRef.current?.value) || 0;
        const inDoorQuantity = Number(refs.inDoorRef.current?.value) || 0;

        try {
            const response = await fetch("/api/orders/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: fullname,
                    address: address,
                    phone: phone,
                    messageSeller: comments,
                    dateOrder: dateOrder,
                    frontDoorQuantity: frontDoorQuantity,
                    inDoorQuantity: inDoorQuantity,
                    doorLimits: {
                        limitDate: dateOrder,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);
            navigate("./done");
        } catch (err) {
            console.error('Error creating order:', err);
        }
    };

    useEffect(() => {
        const frontInput = refs.frontDoorRef.current;
        const inInput = refs.inDoorRef.current;

        const handleInput = (el: HTMLInputElement) => {
            const inputArray = el.value.split('');
            const currentVal = el.value;
            const onlyNumbers = inputArray.every(char => numbers.includes(char));
            if (!onlyNumbers || (currentVal.startsWith('0') && currentVal.length > 1)) {
                el.value = currentVal.slice(0, -1);
            }
        };

        if (frontInput && inInput) {
            frontInput.addEventListener('input', () => handleInput(frontInput));
            inInput.addEventListener('input', () => handleInput(inInput));
        }

        return () => {
            if (frontInput) frontInput.removeEventListener('input', () => handleInput(frontInput));
            if (inInput) inInput.removeEventListener('input', () => handleInput(inInput));
        };
    }, []);

    const handleDateSelected = (dateStr:string) => {
        setSelectedDate(dateStr);
        if (refs.dateRef.current) {
            refs.dateRef.current.value = dateStr;
        }
        setIsCalendarOpen(false);
    };

    return (
        <div className="sellerCreatePage">
            <form onSubmit={sendResultsCreate} className="form-container">
                <h1>Заполните данные о заказе</h1>
                <h3 className="subtitleInput">Укажите данные заказчика</h3>

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
                        onClick={() => setIsCalendarOpen(prev => !prev)}
                    />
                    {isCalendarOpen && (
                        <div ref={calendarRef} className="calendar-container">
                            <CustomCalendar
                                fetchedAvailability={fetchedAvailability}
                                availabilityList={availabilityList}
                                onDateSelected={handleDateSelected}
                                setSelectedDate={setSelectedDate}
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