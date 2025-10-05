import React, {useRef} from 'react';
import './mainInstallerCreate.scss';

import {useNavigate} from "react-router-dom";
export const MainInstallerCreate = () => {

    const navigate = useNavigate();

    const refs = {
        fullName: useRef<HTMLInputElement>(null),
        phone: useRef<HTMLInputElement>(null),
    }

    const sendDataInstaller = async (e: {preventDefault: () => void;}) => {
        e.preventDefault()
        const fullName = refs.fullName.current?.value || '';
        const phone = refs.phone.current?.value || '';

        try {
            await fetch(`/api/listInstallers/create?fullName=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(phone)}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            })

            navigate("/home/mainInstaller")
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="installer-create">
            <form onSubmit={sendDataInstaller} className="installer-create__form">
                <h1 className="installer-create__title">Добавление установщика</h1>
                <h3 className="installer-create__subtitle">Укажите данные установщика</h3>

                <div className="installer-create__group">
                    <label htmlFor="fullName" className="installer-create__label">ФИО:</label>
                    <input
                        type="text"
                        id="fullName"
                        required
                        ref={refs.fullName}
                        placeholder="ФИО"
                        className="installer-create__input"
                    />
                </div>

                <div className="installer-create__group">
                    <label htmlFor="phone" className="installer-create__label">Номер телефона:</label>
                    <input
                        type="text"
                        id="phone"
                        required
                        ref={refs.phone}
                        placeholder="Номер телефона"
                        className="installer-create__input"
                    />
                </div>

                <button type="submit" className="installer-create__submit">
                    Добавить
                </button>
            </form>
        </div>
    );
};
