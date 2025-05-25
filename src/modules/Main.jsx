import React from 'react';
import '../styles/main.css';
import { Popup } from "./special/Popup.jsx";
import imagefun from '../assets/zzz.jpg'
export const Main = () => {
    return (
        <div className="main">
            Main
            <img src={imagefun} alt="mine"/>
            <Popup />
        </div>
    );
};