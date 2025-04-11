import { Routes, Route } from "react-router-dom";
import MainPage from "../modules/MainPage.jsx";
import LoginPage from "../modules/LoginPage.jsx";
import PageNotFound from "../modules/PageNotFound.jsx";


const SiteRoutes = () => {
    return (
        <>
                <Routes>
                    <Route path="/"  element={<MainPage/>}></Route>
                    <Route path="/login"  element={<LoginPage/>}></Route>
                    <Route path="/home/seller"  element={<MainPage/>}></Route>
                    <Route path="*"  element={<PageNotFound/>}></Route>
                </Routes>
        </>
    );
};

export default SiteRoutes;