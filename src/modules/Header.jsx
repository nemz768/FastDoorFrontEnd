import '../styles/header.css';
import logo from '../assets/logo.svg';
import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

export const Header = () => {

    const [message, setMessage] = useState('Hello');

    useEffect(() => {
        fetch("http://localhost:8080/api/hello")
            .then((res) => res.text())
        .then((data) => setMessage(data))
        .catch((err) => console.error(err));
    }, [])

    return (
        <header className="header">
            <img src={logo} alt="dverka"/>
            <p>{message}</p>
            <Link to='login'>Войти</Link>
        </header>
    );
};
