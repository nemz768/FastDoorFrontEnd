import React, {useState} from 'react';
import '../styles/registerPage.css'
import {Link} from "react-router-dom";
export const RegisterPage = () => {



    const [InputValueRegister, SetInputValueRegister] = useState({
        inputUser: '',
        inputPass: '',
        confirm: '',
        fullname: '',
        email: '',
        phone: '',
        role: ''
    });

    function registerToBack()
    {
        console.log(InputValueRegister)
        fetch("/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: InputValueRegister.inputUser,
                password: InputValueRegister.inputPass,
                confirm: InputValueRegister.confirm,
                fullname: InputValueRegister.fullname,
                email: InputValueRegister.email,
                phone: InputValueRegister.phone,
                role: InputValueRegister.role
            })
        })
            .then((res)=> res.json())
            .then((data) => console.log('Server response: ', data))
            .catch((err) => console.error(err));
    }


    return (
        <div className="registerBlock">
            <div className="registration">
                <h1>Регистрация</h1>
                <form className="form-register" method="POST" id="registerForm">
                    <label htmlFor="username">Логин: </label>
                    <input value={InputValueRegister.inputUser} onChange={(e)=> {
                        SetInputValueRegister({
                            ...InputValueRegister,
                            inputUser: e.target.value
                        })
                    }} type="text" id="username" name="username"/>

                    <label htmlFor="password">Пароль: </label>
                    <input value={InputValueRegister.inputPass} onChange={(e)=> {
                        SetInputValueRegister({
                            ...InputValueRegister,
                            inputPass: e.target.value
                        })
                    }} type="password" id="password" name="password"/>

                    <label htmlFor="confirm">Подтвердить Пароль: </label>
                    <input value={InputValueRegister.confirm} onChange={(e)=> {
                        SetInputValueRegister({
                            ...InputValueRegister,
                            confirm: e.target.value
                        })
                    }} type="password" id="confirm" name="confirm"/>

                    <label htmlFor="fullname">ФИО: </label>
                    <input value={InputValueRegister.fullname} onChange={(e)=> {
                        SetInputValueRegister({
                            ...InputValueRegister,
                            fullname: e.target.value
                        })
                    }}  type="text" id="fullname" name="fullname"/>

                    <label htmlFor="email">Почта: </label>
                    <input  value={InputValueRegister.email} onChange={(e)=> {
                        SetInputValueRegister({
                            ...InputValueRegister,
                            email: e.target.value
                        })
                    }} type="email" id="email" name="email"/>

                    <label htmlFor="phone">Номер телефона: </label>
                    <input  value={InputValueRegister.phone} onChange={(e)=> {
                        SetInputValueRegister({
                            ...InputValueRegister,
                            phone: e.target.value
                        })
                    }}  type="text" id="phone" name="phone"
                    />
                    <label htmlFor="role">Роль: </label>
                    <input value={InputValueRegister.role} onChange={(e)=> {
                        SetInputValueRegister({
                            ...InputValueRegister,
                            role: e.target.value
                        })
                    }}  type="text" id="role" name="role"/>
                    <Link to='/check'>
                        <button onClick={()=> {registerToBack()}} className="registration_button" type="submit">Зарегистрироваться</button>
                    </Link>
                </form>
            </div>
        </div>
    );
};
