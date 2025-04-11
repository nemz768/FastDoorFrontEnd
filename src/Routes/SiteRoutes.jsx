import { Routes, Route } from "react-router-dom";
import MainPage from "../modules/MainPage.jsx";
import LoginPage from "../modules/LoginPage.jsx";
import PageNotFound from "../modules/moduleError/PageNotFound.jsx";
import {Seller} from "../modules/Seller.jsx";
import {PageNotEnoughRules} from "../modules/moduleError/PageNotEnoughRules.jsx";


const SiteRoutes = () => {
    return (
        <>
                <Routes>
                    <Route path="/"  element={<MainPage/>}></Route>
                    <Route path="/login"  element={<LoginPage/>}></Route>
                    <Route path="/home/seller"  element={<Seller/>}></Route>
                    <Route path="*"  element={<PageNotFound/>}></Route>
                    <Route path="/test"  element={<PageNotEnoughRules/>}></Route>
                </Routes>
        </>
    );
};

export default SiteRoutes;