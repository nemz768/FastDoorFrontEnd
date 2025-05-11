import React, {useState} from 'react';
import '../../styles/specialStyles/ConfirmPopup.css'


export const ConfirmPopup = ({closeModal, handleDeleteSuccess, orderId}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);



    const deleteOrder = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            const response =  await fetch(`/api/delete/${orderId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }

            })
            if (!response.ok) {
                throw new Error("Error occured");
            }
            handleDeleteSuccess(orderId);
            closeModal();

        }
        catch(err) {
            setError(err)
            console.log(err.message)
        }
        finally {
            setIsDeleting(false);
        }
    }
    return (
        <div className='confirm-popup'>
            <div className="confirm-popup_block">
                <h1>Вы уверены что хотите удалить эту запись?</h1>
                {error && <div className="error">Ошибка: {error}</div>}
                <div className='confirm-popup_content'>
                    <button disabled={isDeleting} onClick={deleteOrder} className="delete-button">{isDeleting ? 'Удаление...' : 'Да'}</button>
                    <button disabled={isDeleting} className="delete-button" onClick={closeModal}>Нет</button>
                </div>
            </div>
        </div>
    );
};
