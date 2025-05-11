import React, {} from 'react';
import '../../styles/specialStyles/ConfirmPopup.css'


export const ConfirmPopup = ({closeModal}) => {


    return (
        <div className='confirm-popup'>
            <div className="confirm-popup_block">
                <h1>Вы уверены что хотите удалить эту запись?</h1>
                <div>
                    <button>Да</button>
                    <button onClick={closeModal}>Нет</button>
                </div>
            </div>
        </div>
    );
};
