import React, {useRef} from 'react';
import '../../../styles/stylePages/createSellerPage.css';
export const MainInstallerCreate = () => {


    const refs = {
        fullName: useRef(null),
        phone: useRef(null),
    }

    const sendDataInstaller = async () => {
        try {
            await fetch('', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    fullName: refs.fullName,
                    phone: refs.phone,
                })
            })
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
                        ref={refs.fullname}
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
