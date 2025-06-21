import React, { useState, useEffect } from 'react';
import '../../../styles/stylePages/SellerAllOrdersPage.css';
import { Header } from '../../Header.jsx';
import { Footer } from '../../Footer.jsx';
import { ConfirmPopup } from '../../special/ConfirmPopup.jsx';
import {SellerOrdersTablePc} from "./SellerOrdersTablePC.jsx";

export const SellerAllOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeModal, setActiveModal] = useState(false); // Исправлено isActiveModal на setActiveModal
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const navItems = [
        { label: 'Главная продавца', route: '/home/seller' },
        { label: 'Создать заказ', route: '/home/seller/create' },
    ];
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/list/sellerList?page=${currentPage}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Не удалось загрузить заказы: ${response.statusText}`);
                }
                const data = await response.json();
                setOrders(
                    data.orders.map((order) => ({
                        ...order,
                        id: String(order.id), // Убедимся, что id - строка
                    })) || []
                );
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
            } catch (err) {
                console.error('Ошибка загрузки заказов:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage]);

    console.log('Orders state:', orders);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const openModal = (orderId) => {
        console.log('Открытие модального окна с orderId:', orderId); // Логирование
        setSelectedOrderId(orderId); // Приведение к строке
        setActiveModal(true);
    };

    const closeModal = () => {
        console.log('Закрытие модального окна, selectedOrderId:', selectedOrderId);
        setSelectedOrderId(null);
        setActiveModal(false);
    };

    const handleDeleteSuccess = (deletedOrderId) => {
        setOrders(orders.filter((order) => order.id !== deletedOrderId));
    };

    return (
        <div className="page-wrapper">
            <Header navItems={navItems}/>
            <SellerOrdersTablePc isLoading={isLoading} error={error} orders={orders} currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} openModal={openModal} />
            {activeModal && (
                <ConfirmPopup
                    handleDeleteSuccess={handleDeleteSuccess}
                    orderId={selectedOrderId}
                    closeModal={closeModal}
                />
            )}
            <Footer />
        </div>
    );
};