import React from 'react';
import { useNavigate } from 'react-router-dom';
import './done-page.scss';
import doneSvg from '../../../../public/check-mark-4820.svg';

export const DonePage = () => {
    const navigate = useNavigate();

    return (
        <div className="done-page">
            <div className="done-page__block">
                <img src={doneSvg} alt="done" />
                <h1 className="done-page__title">Done!</h1>
                <h2 className="done-page__subtitle">Заказ успешно сохранён!</h2>
                <div className="done-page__btns">
                    <button
                        className="done-page__btns-btn"
                        onClick={() => navigate('/home/seller')}
                    >
                        Главная
                    </button>
                    <button
                        className="done-page__btns-btn"
                        onClick={() => navigate('/home/seller/listOrdersSeller')}
                    >
                        К заказам
                    </button>
                </div>
            </div>
        </div>
    );
};
