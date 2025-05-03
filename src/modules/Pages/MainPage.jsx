import React from 'react';
import {Header} from "../Header.jsx";
import {Footer} from "../Footer.jsx";
import {Main} from "../Main.jsx";
import '../../styles/stylePages/main.css'


const MainPage = () => {
    return (
     <div className="mainPage">
         <Header />
         <Main/>
         <Footer />
     </div>
    );
};

export default MainPage;