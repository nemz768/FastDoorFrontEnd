import React from 'react';

export const ConfirmPopupMainInstaller = ({ installerId, handleDeleteSuccess, closeModal }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/listInstallers/delete/${installerId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Произошла ошибка при удалении');
            }

            handleDeleteSuccess(installerId);
            closeModal();
        } catch (error) {
            console.error('Error deleting installer:', error);
            alert(error.message); // Display error to user
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Подтверждение удаления</h3>
                <p>Вы уверены, что хотите удалить установщика с ID {installerId}?</p>
                <button onClick={handleDelete}>Удалить</button>
                <button onClick={closeModal}>Отмена</button>
            </div>
        </div>
    );
};