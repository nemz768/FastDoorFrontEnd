import React from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import './donePage.css'
import doneSvg from '../../../public/check-mark-4820.svg'
export const DonePage = () => {
    const navigate = useNavigate();


    return (
        <div className="donePage">
            <div className="donePage-block">
                <img src={doneSvg} alt="done"/>
                <h1 className="donePage-title">Done!</h1>
                <h2 className="donePage-subtitle">Заказ успешно сохранён!</h2>
                <div className="donePage-btns">
                    <button className="donePage-btn"
                            onClick={()=> navigate("/home/seller")}>
                        Главная</button>
                    <button className="donePage-btn"
                            onClick={()=> navigate("/home/seller/listOrdersSeller")}>
                        К заказам</button>
                </div>
            </div>
        </div>
    );
};

