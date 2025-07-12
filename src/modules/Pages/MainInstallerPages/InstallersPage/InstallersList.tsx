import React, { useEffect, useState } from 'react';
import { Header } from '../../../Widgets/Header/Header';
import { Footer } from '../../../Widgets/Footer/Footer';
import './installers.css';
import { useNavigate } from 'react-router-dom';
import { ConfirmPopupMainInstaller } from './ConfirmPopupMainInstaller';
import {Popup} from "../../../Widgets/Popup/Popup";
import {Pagination} from "../../../Widgets/Pagination/Pagination";



interface InstallersListType {
    id: number;
    fullName: string;
    phone: string;
}

export const InstallersList : React.FC = () => {
    const [installers, setInstallers] = useState<InstallersListType[]>([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedInstallerId, setSelectedInstallerId] = useState<number | null>(null);
    const [activeModal, setActiveModal] = useState(false);
    const [editingInstallerId, setEditingInstallerId] = useState<number | null>(null);
    const [message, sendMessage] = useState('');



    const [editedInstaller, setEditedInstaller] = useState<{fullName: string; phone: string}>({
        fullName: '',
        phone: ''
    });

    const navItems = [
        { label: 'Главная', route: '/home/mainInstaller/' },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
        { label: 'Полный список заказов', route: '/home/mainInstaller/listOrdersMainInstaller' },
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
                setInstallers(data.installers.map((item: InstallersListType) => ({
                    ...item,
                    fullName: item.fullName,

                })));
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
            } catch (error: any) {
                console.error('Ошибка при загрузке установщиков:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        getInstallers();
    }, [currentPage]);

    const saveDataInstaller = async (installerId:number) => {
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

            setInstallers(prev =>
                prev.map(installer =>
                    installer.id === installerId
                        ? { ...installer, fullName, phone }
                        : installer
                )
            );

            // Выйти из режима редактирования
            setEditingInstallerId(null);
            sendMessage('Данные успешно обновлены!');
            setTimeout(() => sendMessage(''), 3000);

        }catch (err) {
            console.log(err)
            setError("Ошибка при сохранении данных установщика")
        }


    }

    const openModal = (installerId:number) => {
        console.log('Открытие модального окна с installerId:', installerId);
        setSelectedInstallerId(installerId);
        setActiveModal(true);
    };

    const closeModal = () => {
        console.log('Закрытие модального окна, selectedInstallerId:', selectedInstallerId);
        setSelectedInstallerId(null);
        setActiveModal(false);
    };

    const handleDeleteSuccess = (deletedInstallerId:number | null) => {
        setInstallers(installers.filter((installer) => installer.id !== deletedInstallerId));
    };

    const handleChangeBtn = (installer: InstallersListType) => {
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
                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>

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
            <Footer/>
            {message && (
                <div className="toast-notification">
                    {message}
                </div>
            )}
            <Popup navItems={navItems}/>
        </div>
    );
};