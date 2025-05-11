import React from 'react';
import {Header} from "../Header.jsx";
import {Footer} from "../Footer.jsx";
import "../../styles/stylePages/SellerAllOrdersPage.css"


export const SellerAllOrdersPage = () => {

    const getApi = async () => {
        try {
            const response = await fetch("/api/list/sellerList", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }

            })
            const data = await response.json();
            console.log(data)
        }catch(err) {
            console.log(err)
        }
    }
    getApi()



    return (
        <>
            <Header/>
            <div className="SellerAllOrdersPage">
                123
            </div>
            <Footer/>
        </>
    );
};
