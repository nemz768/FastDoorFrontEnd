import '../styles/header.css';
import logo from '../assets/logo.svg';
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from "./Auth/AuthContext.jsx";

export const Header = () => {
    const navigate = useNavigate();
    const {isLoggedIn, getRoles} = useAuth();


    const toNeededNavigate = ()=> {
        if (getRoles === "salespeople") {
            navigate('/home/seller/listOrdersSeller')
        }
    }

    return (
        <header className="header">
            <Link to='/'><img src={logo} alt="dverka"/></Link>

            {isLoggedIn ? (
                <nav className="header-nav">
                    <button>Выйти</button>
                    <a onClick={toNeededNavigate}>toMainPage</a>
                </nav>
            ) : (
                <nav className="header-nav">
                    <Link to='/login'>Войти</Link>
                    <Link to='/reg'>Регистрация</Link>
                </nav>
            )
            }
         </header>
    );
};
