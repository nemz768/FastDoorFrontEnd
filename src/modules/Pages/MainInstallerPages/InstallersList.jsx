import React, { useEffect, useState } from 'react';
import { Header } from '../../Header.jsx';
import { Footer } from '../../Footer.jsx';
import '../../../styles/styleMainInstaller/installers.css';
import { useNavigate } from 'react-router-dom';
import { ConfirmPopupMainInstaller } from './ConfirmPopupMainInstaller.jsx';

export const InstallersList = () => {
    const [installers, setInstallers] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedInstallerId, setSelectedInstallerId] = useState(null);
    const [activeModal, setActiveModal] = useState(false);
    const [editingInstallerId, setEditingInstallerId] = useState(null);



    const [editedInstaller, setEditedInstaller] = useState({
        fullName: '',
        phone: ''
    });

    const navItems = [
        { label: 'Главная', route: '/home/mainInstaller/' },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
        { label: 'Список заказов', route: '/404' },
    ];

    useEffect(() => {
        const getInstallers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/listInstallers?page=${currentPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log('Полученные данные:', data);
                setInstallers(data.installers.map((item) => ({
                    ...item,
                    fullName: item.fullName,

                })));
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
            } catch (error) {
                console.error('Ошибка при загрузке установщиков:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        getInstallers();
    }, [currentPage]);

    const saveDataInstaller = async (installerId) => {
        const { fullName, phone } = editedInstaller;

        try {
            const response = await fetch(`/api/installer/${installerId}?fullName=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(phone)}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            // Обновить локально
            setInstallers(prev =>
                prev.map(installer =>
                    installer.id === installerId
                        ? { ...installer, fullName, phone }
                        : installer
                )
            );

            // Выйти из режима редактирования
            setEditingInstallerId(null);
        }catch (err) {
            console.log(err)
            setError("Ошибка при сохранении данных установщика")
        }


    }

    const openModal = (installerId) => {
        console.log('Открытие модального окна с installerId:', installerId);
        setSelectedInstallerId(installerId);
        setActiveModal(true);
    };

    const closeModal = () => {
        console.log('Закрытие модального окна, selectedInstallerId:', selectedInstallerId);
        setSelectedInstallerId(null);
        setActiveModal(false);
    };

    const handleDeleteSuccess = (deletedInstallerId) => {
        setInstallers(installers.filter((installer) => installer.id !== deletedInstallerId));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleChangeBtn = (installer) => {
        setEditingInstallerId(installer.id);
        setEditedInstaller({ fullName: installer.fullName, phone: installer.phone });
    };


    return (
        <div>
            <Header navItems={navItems} />
            {isLoading && <div className="loading">Загрузка...</div>}
            {error && <div className="error">Ошибка: {error}</div>}
            {!isLoading && !error && installers.length === 0 && (
                <div className="no-orders">Заказы не найдены</div>
            )}
            {!isLoading && !error && installers.length > 0 && (
                <div className="admin-panel">
                    <table className="installers-table">
                        <thead>
                        <tr>
                            <th>Фио Установщика</th>
                            <th>Номер телефона</th>
                            <th>Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                        {installers.map((item) => (
                            <tr key={item.id}>
                                {editingInstallerId === item.id ? (
                                    <>
                                        <td><input     value={editedInstaller.fullName}
                                                       onChange={(e) => setEditedInstaller(prev => ({ ...prev, fullName: e.target.value }))}
                                                       defaultValue={item.fullName} /></td>
                                        <td><input     value={editedInstaller.phone}
                                                       onChange={(e) => setEditedInstaller(prev => ({ ...prev, phone: e.target.value }))}
                                                       defaultValue={item.phone} /></td>
                                    </>
                                ) : (
                                    <>
                                        <td>{item.fullName}</td>
                                        <td>{item.phone}</td>
                                    </>
                                )}
                                <td>
                                    {editingInstallerId === item.id ? (
                                        <button onClick={() => saveDataInstaller(item.id)}>Сохранить</button>
                                    ) : (
                                        <button onClick={() => handleChangeBtn(item)}>Изменить</button>
                                    )}
                                    <button onClick={() => openModal(item.id)}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="pagination-button"
                        >
                            Предыдущая
                        </button>
                        <span className="pagination-info">
                            Страница {currentPage + 1} из {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="pagination-button"
                        >
                            Следующая
                        </button>
                    </div>
                    <button
                        className="add-installer-button"
                        onClick={() => navigate('/home/mainInstaller/create')}
                    >
                        Добавить установщика
                    </button>
                </div>
            )}
            {activeModal && (
                <ConfirmPopupMainInstaller
                    handleDeleteSuccess={handleDeleteSuccess}
                    installerId={selectedInstallerId}
                    closeModal={closeModal}
                />
            )}
            <Footer className="footer-installer" />
        </div>
    );
};