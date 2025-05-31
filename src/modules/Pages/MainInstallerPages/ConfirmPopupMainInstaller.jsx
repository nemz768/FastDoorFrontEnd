import React, {useState} from 'react';
import '../../../styles/specialStyles/ConfirmPopup.css';
export const ConfirmPopupMainInstaller = ({handleDeleteSuccess, installerId, closeModal}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);



    const deleteInstaller = async () => {

        setError(null);
        try {
            const response = await fetch(`/api/listInstallers/delete/${installerId}`, {
                method: "DELETE",
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Произошла ошибка при удалении');
            }
            handleDeleteSuccess(installerId);
            closeModal();
        }
        catch (error) {
            console.log(error)
            setError(error);
        }
        finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="confirm-popup">
            <div className="confirm-popup_block">
                <h1>Вы уверены, что хотите удалить установщика?</h1>
                {error && <div className="error">Ошибка: {error}</div>}
                <div className="confirm-popup_content">
                    <button
                        disabled={isDeleting}
                        onClick={deleteInstaller}
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

