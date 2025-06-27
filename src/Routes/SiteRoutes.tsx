import { Routes, Route } from "react-router-dom";
import MainPage from "../modules/Pages/MainPage.js";
import LoginPage from "../modules/Pages/LoginPage.js";
import PageNotFound from "../modules/moduleError/PageNotFound.js";
import {SellerPage} from "../modules/Pages/SellerPages/SellerPage.jsx";
import {PageNotEnoughRules} from "../modules/moduleError/PageNotEnoughRules.js";
import {Check} from "../modules/Pages/Check.js";
import {RegisterPage} from '../modules/Pages/RegisterPage.js';
import {SellerCreatePage} from "../modules/Pages/SellerPages/SellerCreatePage.jsx";
import {DonePage} from "../modules/Pages/DonePage.js";
import {MainInstallerPage} from "../modules/Pages/MainInstallerPages/MainInstallerPage.js";
import {SellerAllOrdersPage} from "../modules/Pages/SellerPages/SellerAllOrdersPage.jsx";
import {PatchOrderPage} from "../modules/Pages/SellerPages/PatchOrderPage.jsx";
import {AdminPanelPage} from "../modules/Pages/Administrator/adminPanelPage.js";
import {MainInstallerCreate} from "../modules/Pages/MainInstallerPages/MainInstallerCreate.js";
import {InstallersList} from "../modules/Pages/MainInstallerPages/InstallersList.js";
import {MainInstallerAllOrders} from "../modules/Pages/MainInstallerPages/MainInstallerAllOrders.js";



export const SiteRoutes = () => {
    return (
        <>
                <Routes>
                    <Route path="/"  element={<MainPage/>}></Route>
                    <Route path="/login"  element={<LoginPage/>}></Route>
                    <Route path="/home/seller"  element={<SellerPage/>}></Route>
                    <Route path="/home/seller/create"  element={<SellerCreatePage/>}></Route>
                    <Route path="/home/seller/listOrdersSeller" element={<SellerAllOrdersPage/>}></Route>
                    <Route path="/home/seller/listOrdersSeller/edit/:orderId" element={<PatchOrderPage/>}/>
                    <Route path="/403"  element={<PageNotEnoughRules/>}></Route>
                    <Route path="/check" element={<Check/>}></Route>
                    <Route path="/reg" element={<RegisterPage/>}></Route>
                    <Route path="/home/seller/create/done" element={<DonePage/>}></Route>
                    <Route path="/home/mainInstaller" element={<MainInstallerPage/>}></Route>
                    <Route path="/home/mainInstaller/InstallersList" element={<InstallersList/>}></Route>
                    <Route path="/home/mainInstaller/listOrdersMainInstaller" element={<MainInstallerAllOrders/>}></Route>
                    <Route path="/home/mainInstaller/create" element={<MainInstallerCreate/>}></Route>
                    <Route path="/home/admin" element={<AdminPanelPage/>}></Route>
                    <Route path="*"  element={<PageNotFound/>}></Route>
                 </Routes>
        </>
    );
};
