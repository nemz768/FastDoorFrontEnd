import React, {useRef} from 'react';
import '../../../styles/stylePages/createSellerPage.css';
import {useNavigate} from "react-router-dom";
export const MainInstallerCreate = () => {

    const navigate = useNavigate();

    const refs = {
        fullName: useRef(null),
        phone: useRef(null),
    }

    const sendDataInstaller = async (e) => {
        e.preventDefault()

        const fullName = refs.fullName.current?.value;
        const phone = refs.phone.current?.value;

        try {
         const response = await fetch('/api/listInstallers/create', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                fullName: String(fullName),
                 phone: String(phone),
             })
         })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);
            navigate("/home/mainInstaller")
        }
        catch(err) {
           console.log(err);
        }
    }

    return (
        <div className="sellerCreatePage">
            <form onSubmit={sendDataInstaller} className="form-container">
                <h1>Добавление установщика</h1>
                <h3 className="subtitleInput">Укажите данные установщика</h3>

                <div className="input-group">
                    <label htmlFor="fullName">ФИО: </label>
                    <input
                        type="text"
                        className="input_SellerPage"
                        id="fullName"
                        required
                        ref={refs.fullName}
                        placeholder="ФИО"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="phone">Номер телефона: </label>
                    <input
                        type="text"
                        className="input_SellerPage"
                        id="phone"
                        required
                        ref={refs.phone}
                        placeholder="Номер телефона"
                    />
                </div>


                <button id="submitButton" type="submit" className="submit-btn">Добавить</button>
            </form>
        </div>
    );
};
