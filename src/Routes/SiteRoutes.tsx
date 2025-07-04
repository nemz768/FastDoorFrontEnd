import { Routes, Route } from "react-router-dom";
import {MainPage} from "../modules/Pages/MainPage/MainPage";
import {LoginPage} from "../modules/Pages/LoginPage/LoginPage";
import {PageNotFound} from "../modules/Pages/PageNotFound/PageNotFound";
import {SellerPage} from "../modules/Pages/SellerPages/SellerPage/SellerPage";
import {PageNotEnoughRules} from "../modules/Pages/PageNotEnoughRules/PageNotEnoughRules";
import {RegisterPage} from '../modules/Pages/RegisterPage/RegisterPage';
import {SellerCreatePage} from "../modules/Pages/SellerPages/SellerCreatePage/SellerCreatePage";
import {DonePage} from "../modules/Pages/DonePage/DonePage";
import {MainInstallerPage} from "../modules/Pages/MainInstallerPages/MainInstallerPage/MainInstallerPage";
import {SellerAllOrdersPage} from "../modules/Pages/SellerPages/SellerAllOrdersPage/SellerAllOrdersPage";
import {PatchOrderPage} from "../modules/Pages/SellerPages/PatchOrderPage/PatchOrderPage";
import {AdminPanelPage} from "../modules/Pages/Administrator/adminPanelPage";
import {MainInstallerCreate} from "../modules/Pages/MainInstallerPages/InstallerCreatePage/MainInstallerCreate";
import {InstallersList} from "../modules/Pages/MainInstallerPages/InstallersPage/InstallersList";
import {MainInstallerAllOrders} from "../modules/Pages/MainInstallerPages/AllOrdersPage/MainInstallerAllOrders";



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
