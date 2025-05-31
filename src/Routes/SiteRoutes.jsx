import { Routes, Route } from "react-router-dom";
import MainPage from "../modules/Pages/MainPage.jsx";
import LoginPage from "../modules/Pages/LoginPage.jsx";
import PageNotFound from "../modules/moduleError/PageNotFound.jsx";
import {SellerPage} from "../modules/Pages/SellerPages/SellerPage.jsx";
import {PageNotEnoughRules} from "../modules/moduleError/PageNotEnoughRules.jsx";
import {Check} from "../modules/Pages/Check.jsx";
import {RegisterPage} from '../modules/Pages/RegisterPage.jsx';
import {SellerCreatePage} from "../modules/Pages/SellerPages/SellerCreatePage.jsx";
import {DonePage} from "../modules/Pages/DonePage.jsx";
import {MainInstallerPage} from "../modules/Pages/MainInstallerPages/MainInstallerPage.jsx";
import {SellerAllOrdersPage} from "../modules/Pages/SellerPages/SellerAllOrdersPage.jsx";
import {PatchOrderPage} from "../modules/Pages/SellerPages/PatchOrderPage.jsx";
import {AdminPanelPage} from "../modules/Pages/Administrator/adminPanelPage.jsx";
import {MainInstallerCreate} from "../modules/Pages/MainInstallerPages/MainInstallerCreate.jsx";
import {InstallersList} from "../modules/Pages/MainInstallerPages/InstallersList.jsx";



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
                    <Route path="/home/mainInstaller/create" element={<MainInstallerCreate/>}></Route>
                    <Route path="/home/admin" element={<AdminPanelPage/>}></Route>
                    <Route path="*"  element={<PageNotFound/>}></Route>
                 </Routes>
        </>
    );
};
