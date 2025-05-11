import React, { useState, useEffect } from 'react';
import '../../styles/stylePages/SellerAllOrdersPage.css';

export const SellerAllOrdersPage = () => {
    const [orders, setOrders] = useState([]); // Changed 'order' to 'orders' for clarity

    // Use useEffect to handle API calls
    useEffect(() => {
        const getApi = async () => {
            try {
                const response = await fetch("/api/list/sellerList", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json(); // Parse JSON here
                setOrders(data); // Set the parsed data
                console.log(data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };

        getApi();
    }, []); // Empty dependency array to run once on mount

    return (
        <div className="SellerAllOrdersPage">
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order.orders.id}>{orders.orders.id}</div> // Render each order ID
                ))
            ) : (
                <div>No orders found</div>
            )}
        </div>
    );
};