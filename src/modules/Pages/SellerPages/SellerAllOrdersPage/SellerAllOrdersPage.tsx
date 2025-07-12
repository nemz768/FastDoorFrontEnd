import React, { useState, useEffect } from 'react';
import './SellerAllOrdersPage.css';
import { Header } from '../../../Widgets/Header/Header';
import { Footer } from '../../../Widgets/Footer/Footer';
import { ConfirmPopup } from '../../../Widgets/ConfirmPopup/ConfirmPopup';
import {SellerOrdersTable} from "./SellerOrdersTable/SellerOrdersTable";
import {Order, OrdersResponse} from '../../../Interfaces/Interfaces'
import {Popup} from "../../../Widgets/Popup/Popup";

export const SellerAllOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const navItems = [
        { label: 'Главная', route: '/home/seller' },
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
                const data: OrdersResponse = await response.json();
                setOrders(
                    data.orders.map((order) => ({
                        ...order,
                        id: String(order.id), // Убедимся, что id - строка
                    })) || []
                );
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.currentPage || 0);
            } catch (err:any) {
                console.error('Ошибка загрузки заказов:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage]);


    const handlePageChange = (newPage:number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const openModal = (orderId:string) => {
        setSelectedOrderId(orderId); // Приведение к строке
        setActiveModal(true);
    };

    const closeModal = () => {
        setSelectedOrderId(null);
        setActiveModal(false);
    };

    const handleDeleteSuccess = (deletedOrderId:string) => {
        setOrders(orders.filter((order) => order.id !== deletedOrderId));
    };

    return (
        <div className="page-wrapper">
            <Header navItems={navItems}/>
            <SellerOrdersTable isLoading={isLoading} error={error} orders={orders} currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} openModal={openModal} />
            {activeModal && (
                <ConfirmPopup
                    handleDeleteSuccess={handleDeleteSuccess}
                    orderId={selectedOrderId}
                    closeModal={closeModal}
                />
            )}
            <Footer />
            <Popup navItems={navItems}/>
        </div>
    );
};