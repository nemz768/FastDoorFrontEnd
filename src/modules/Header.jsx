import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const MainInstallerCreate = () => {
    const navigate = useNavigate();

    const refs = {
        fullName: useRef(null),
        phone: useRef(null),
    };

    const sendDataInstaller = async (e) => {
        e.preventDefault();

        const fullName = refs.fullName.current?.value.trim();
        const phone = refs.phone.current?.value.trim();

        // Basic client-side validation
        if (!fullName || !phone) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        // Optional: Validate phone format (example: simple regex for phone numbers)
        const phoneRegex = /^\+?\d{10,15}$/;
        if (!phoneRegex.test(phone)) {
            alert('Пожалуйста, введите корректный номер телефона.');
            return;
        }

        try {
            const response = await fetch('/api/listInstallers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    phone,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            console.log('Server response:', data);
            navigate('/home/mainInstaller');
        } catch (err) {
            console.error('Error:', err);
            alert(`Ошибка при отправке данных: ${err.message}`);
        }
    };

    return (
        <div className="sellerCreatePage">
            <form onSubmit={sendDataInstaller} className="form-container">
                <h1>Добавление установщика</h1>
                <h3 className="subtitleInput">Укажите данные установщика</h3>

                <div className="input-group">
                    <label htmlFor="fullName">ФИО: </label>
                    <input
                        type="text"
                        className="input_SellerPage"
                        id="fullName"
                        required
                        ref={refs.fullName} // Fixed: Changed refs.fullname to refs.fullName
                        placeholder="ФИО"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="phone">Номер телефона: </label>
                    <input
                        type="text"
                        className="input_SellerPage"
                        id="phone"
                        required
                        ref={refs.phone}
                        placeholder="Номер телефона"
                    />
                </div>

                <button id="submitButton" type="submit" className="submit-btn">
                    Добавить
                </button>
            </form>
        </div>
    );
};