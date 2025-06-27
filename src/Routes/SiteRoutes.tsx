import { Routes, Route } from "react-router-dom";
import MainPage from "../modules/Pages/MainPage";
import LoginPage from "../modules/Pages/LoginPage";
import PageNotFound from "../modules/moduleError/PageNotFound";
import {SellerPage} from "../modules/Pages/SellerPages/SellerPage";
import {PageNotEnoughRules} from "../modules/moduleError/PageNotEnoughRules";
import {Check} from "../modules/Pages/Check";
import {RegisterPage} from '../modules/Pages/RegisterPage';
import {SellerCreatePage} from "../modules/Pages/SellerPages/SellerCreatePage";
import {DonePage} from "../modules/Pages/DonePage";
import {MainInstallerPage} from "../modules/Pages/MainInstallerPages/MainInstallerPage";
import {SellerAllOrdersPage} from "../modules/Pages/SellerPages/SellerAllOrdersPage";
import {PatchOrderPage} from "../modules/Pages/SellerPages/PatchOrderPage";
import {AdminPanelPage} from "../modules/Pages/Administrator/adminPanelPage";
import {MainInstallerCreate} from "../modules/Pages/MainInstallerPages/MainInstallerCreate";
import {InstallersList} from "../modules/Pages/MainInstallerPages/InstallersList";
import {MainInstallerAllOrders} from "../modules/Pages/MainInstallerPages/MainInstallerAllOrders";



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
