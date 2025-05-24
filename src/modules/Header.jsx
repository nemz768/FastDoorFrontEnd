import '../styles/header.css';
import logo from '../assets/logo.svg';
import {Link} from 'react-router-dom'
import {useAuth} from "./Auth/AuthContext.jsx";

export const Header = () => {

    const {isLoggedIn} = useAuth();


    return (
        <header className="header">
            <Link to='/'><img src={logo} alt="dverka"/></Link>

            {isLoggedIn ? (
                <nav className="header-nav">
                    <button>Выйти</button>
                    <Link to='/reg'>toMainPage</Link>
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
