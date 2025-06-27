import React from 'react';
import {Link} from 'react-router-dom';



export const DonePage = () => {
    return (
        <div className="container">
            <div className="icon">✓</div>
            <h2>Заказ успешно сохранён!</h2>
            <Link to="/home/seller" className="btn">Вернуться на главную</Link>
        </div>
    );
};

