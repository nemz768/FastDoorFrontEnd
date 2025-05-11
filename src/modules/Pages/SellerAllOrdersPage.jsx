import React from 'react';
import '../../styles/stylePages/SellerAllOrdersPage.css';

export const SellerAllOrdersPage = () => {

    const getApi = () => {
       fetch("/api/list/sellerList", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }
    getApi();

    return (
        <div className="SellerAllOrdersPage">
            123
        </div>
    );
};