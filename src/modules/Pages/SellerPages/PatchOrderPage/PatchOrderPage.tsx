import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'pikaday/css/pikaday.css';
import './PatchOrderPage.css';
import { CustomCalendar } from '../../../Widgets/CustomCalendar/CustomCalendar';
import xSymbol from '../../../../../public/x-symbol.svg'

interface OrderInputValues {
    fullName: string;
    address: string;
    phone: string;
    messageSeller: string;
    dateOrder: string;
    frontDoorQuantity: string; // строка, чтобы контролировать ввод
    inDoorQuantity: string;
}

interface Availability {
    date: string;
    available: boolean;
    frontDoorQuantity: number;
    inDoorQuantity: number;
    formattedDate?: string;
}

export const PatchOrderPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const calendarRef = useRef<HTMLDivElement | null>(null);
    const dateRef = useRef<HTMLInputElement | null>(null);

    const [inputValue, setInputValue] = useState<OrderInputValues>({
        fullName: '',
        address: '',
        phone: '',
        messageSeller: '',
        dateOrder: '',
        frontDoorQuantity: '',
        inDoorQuantity: '',
    });

    const [fetchedAvailability, setFetchedAvailability] = useState<Availability[]>([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {
            if (!orderId) return;

            try {
                const response = await fetch(`/api/edit/${orderId}`);
                const data = await response.json();

                setInputValue({
                    fullName: data.orderAttribute.fullName,
                    address: data.orderAttribute.address,
                    phone: data.orderAttribute.phone,
                    messageSeller: data.orderAttribute.messageSeller,
                    dateOrder: data.orderAttribute.dateOrder,
                    frontDoorQuantity: String(data.orderAttribute.frontDoorQuantity),
                    inDoorQuantity: String(data.orderAttribute.inDoorQuantity),
                });
            } catch (err) {
                console.error(err);
            }
        };
        getData();
    }, [orderId]);

    useEffect(() => {
        const showCountOfDoors = async () => {
            try {
                const res = await fetch('/api/orders/create');
                const data = await res.json();
                setFetchedAvailability(data.availabilityList || []);
            } catch (err) {
                console.error('Error fetching availability:', err);
            }
        };
        showCountOfDoors();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                calendarRef.current &&
                !calendarRef.current.contains(event.target as Node) &&
                dateRef.current &&
                !dateRef.current.contains(event.target as Node)
            ) {
                setIsCalendarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        // Для числовых полей запрет на буквы
        if ((id === 'frontDoorQuantity' || id === 'inDoorQuantity') && !/^\d*$/.test(value)) {
            return;
        }

        setInputValue((prev) => ({ ...prev, [id]: value }));
    };

    const handleDateSelected = (dateStr: string) => {
        setInputValue((prev) => ({ ...prev, dateOrder: dateStr }));
        setIsCalendarOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orderId) {
            console.error('No orderId');
            return;
        }

        const payload = {
            fullName: inputValue.fullName,
            address: inputValue.address,
            phone: inputValue.phone,
            messageSeller: inputValue.messageSeller,
            dateOrder: inputValue.dateOrder,
            frontDoorQuantity: Number(inputValue.frontDoorQuantity),
            inDoorQuantity: Number(inputValue.inDoorQuantity),
        };

        try {
            const response = await fetch(`/api/edit/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP Error ${response.status}`);
            }

            navigate('/home/seller/listOrdersSeller/');
        } catch (err: any) {
            console.error('PATCH Error:', err.message);
        }
    };

    return (
        <div className="sellerCreatePage">
            <form onSubmit={handleSubmit} className="form-container">
                <div onClick={()=> navigate(-1)} className="xSymbol">
                    <img className="xSymbol-img" src={xSymbol} alt="X"/>
                </div>
                <h1>Заполните данные о заказе</h1>
                <h3 className="subtitleInput">Укажите данные заказчика</h3>

                <div className="sellerCreatePage_elements">
                    <div className="input-group">
                        <label htmlFor="fullName">ФИО</label>
                        <input
                            id="fullName"
                            value={inputValue.fullName}
                            onChange={handleChange}
                            required
                            placeholder="ФИО"
                            className="input_SellerPage bg-white"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="address">Адрес</label>
                        <input
                            id="address"
                            value={inputValue.address}
                            onChange={handleChange}
                            required
                            placeholder="Адрес"
                            className="input_SellerPage bg-white"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="phone">Телефон</label>
                        <input
                            id="phone"
                            value={inputValue.phone}
                            onChange={handleChange}
                            required
                            placeholder="Номер телефона"
                            className="input_SellerPage bg-white"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="messageSeller">Комментарий</label>
                        <input
                            id="messageSeller"
                            value={inputValue.messageSeller}
                            onChange={handleChange}
                            required
                            placeholder="Комментарий"
                            className="input_SellerPage bg-white"
                        />
                    </div>

                    <h3 className="subtitleInput">Укажите прочие данные</h3>

                    <div className="input-group">
                        <label htmlFor="dateOrder">Дата доставки</label>
                        <input
                            id="dateOrder"
                            value={inputValue.dateOrder}
                            onClick={() => setIsCalendarOpen((prev) => !prev)}
                            readOnly
                            required
                            placeholder="Выбрать дату"
                            className="input_SellerPage bg-white"
                            ref={dateRef}
                        />
                        {isCalendarOpen && (
                            <div ref={calendarRef} className="calendar-container">
                                <CustomCalendar
                                    fetchedAvailability={fetchedAvailability}
                                    availabilityList={fetchedAvailability}
                                    onDateSelected={handleDateSelected}
                                    setSelectedDate={(d: string) => handleDateSelected(d)}
                                    selectedDate={inputValue.dateOrder}
                                />
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label htmlFor="frontDoorQuantity">Количество входных дверей</label>
                        <input
                            id="frontDoorQuantity"
                            value={inputValue.frontDoorQuantity}
                            onChange={handleChange}
                            required
                            placeholder="Входные двери"
                            className="input_SellerPage bg-white"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="inDoorQuantity">Количество межкомнатных дверей</label>
                        <input
                            id="inDoorQuantity"
                            value={inputValue.inDoorQuantity}
                            onChange={handleChange}
                            required
                            placeholder="Межкомнатные двери"
                            className="input_SellerPage bg-white"
                        />
                    </div>

                    <div className="buttons-group">
                        <button type="button" className="confirmBtn" onClick={() => navigate('/home/seller/listOrdersSeller/')}>
                            Отмена
                        </button>
                        <button type="submit" className="confirmBtn">
                            Подтвердить
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
