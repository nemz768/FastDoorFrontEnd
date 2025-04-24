import { Routes, Route } from "react-router-dom";
import MainPage from "../modules/Pages/MainPage.jsx";
import LoginPage from "../modules/Pages/LoginPage.jsx";
import PageNotFound from "../modules/moduleError/PageNotFound.jsx";
import {SellerPage} from "../modules/Pages/SellerPage.jsx";
import {PageNotEnoughRules} from "../modules/moduleError/PageNotEnoughRules.jsx";
import {Check} from "../modules/Pages/Check.jsx";
import {RegisterPage} from '../modules/Pages/RegisterPage.jsx';
import {SellerCreatePage} from "../modules/Pages/SellerCreatePage.jsx";
import {DonePage} from "../modules/Pages/donePage.jsx";



const SiteRoutes = () => {
    return (
        <>
                <Routes>
                    <Route path="/"  element={<MainPage/>}></Route>
                    <Route path="/login"  element={<LoginPage/>}></Route>
                    <Route path="/home/seller"  element={<SellerPage/>}></Route>
                    <Route path="/home/seller/create"  element={<SellerCreatePage/>}></Route>
                    <Route path="*"  element={<PageNotFound/>}></Route>
                    <Route path="/403"  element={<PageNotEnoughRules/>}></Route>
                    <Route path="/check" element={<Check/>}></Route>
                    <Route path="/reg" element={<RegisterPage/>}></Route>
                    <Route path="/done" element={<DonePage/>}></Route>
                </Routes>
        </>
    );
};

export default SiteRoutes;