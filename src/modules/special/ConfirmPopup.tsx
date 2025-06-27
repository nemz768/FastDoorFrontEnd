import React, { useState } from 'react';
import '../../styles/specialStyles/ConfirmPopup.css';

export const ConfirmPopup = ({ closeModal, handleDeleteSuccess, orderId }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const deleteOrder = async () => {
        if (!orderId || typeof orderId !== 'string') {
            setError('Неверный идентификатор заказа');
            console.error('Invalid orderId:', orderId);
            return;
        }

        setIsDeleting(true);
        setError(null);
        try {
            const response = await fetch(`/api/delete?id=${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Произошла ошибка при удалении');
            }
            handleDeleteSuccess(orderId);
            closeModal();
        } catch (err) {
            setError(err.message);
            console.error('Delete error:', err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="confirm-popup">
            <div className="confirm-popup_block">
                <h1>Вы уверены, что хотите удалить эту запись?</h1>
                {error && <div className="error">Ошибка: {error}</div>}
                <div className="confirm-popup_content">
                    <button
                        disabled={isDeleting}
                        onClick={deleteOrder}
                        className="confirm-button"
                    >
                        {isDeleting ? 'Удаление...' : 'Да'}
                    </button>
                    <button
                        disabled={isDeleting}
                        className="cancel-button"
                        onClick={closeModal}
                    >
                        Нет
                    </button>
                </div>
            </div>
        </div>
    );
};