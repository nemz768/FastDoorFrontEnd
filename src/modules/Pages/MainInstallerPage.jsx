import React from 'react';
import {Header} from "../Header.jsx";
import {Footer} from "../Footer.jsx";
import '../../styles/stylePages/mainInstallerPage.css'

export const MainInstallerPage = () => {


    const getInfo = async () => {
        try {
            const response = await fetch("/api/mainInstaller");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };
    getInfo().then(data => console.log(data)).catch(err => console.error(err));


    return (
        <>
            <Header/>

            <div className="main-installer-block">
                <table border="1">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Адрес доставки</th>
                        <th>Номер</th>
                        <th>Дата и время</th>
                        <th>Количесто входных дверей</th>
                        <th>Количесто межкомнатных дверей</th>
                        <th>Установщик</th>
                        <th>Коментарий продавца</th>
                        <th>Ваш коментарий</th>
                        <th>Действие</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <select className="worker-select"
                                    onChange="DisabledOff(this)" data-order-id="${order.id}">
                                <option value="">Выберите установщика</option>
                                <option></option>
                            </select>
                        </td>

                        <td></td>
                        <td>
                            <input id="mainInstallerComment" type="text"/>
                        </td>

                        <td>
                            <button className="btn-confirm"
                                    disabled
                                    type="button"
                            >
                                Подтвердить заказ
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div className="pagination">
                    <form action="/home/mainInstaller" method="get" className="pagination-form">
                        <input type="hidden" name="page"/>
                        <input type="hidden" name="size" />
                        <button type="submit">Предыдущая</button>
                    </form>

                    <span>Страница <span></span> из <span></span></span>

                    <form action="/home/mainInstaller" method="get" className="pagination-form">
                        <input type="hidden" name="page" />
                        <input type="hidden" name="size"
                        />
                        <button type="submit">Следующая</button>
                    </form>
                </div>
                <h2>Доступность дверей на неделю</h2>

                <div className="calendar-container">

                    <div className="calendar-div">
                        <div id="calendar">
                            <div id="calendar-popup"></div>
                        </div>
                    </div>
                    <div className="availability-table">
                        <table border="1">
                            <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Доступные входные двери</th>
                                <th>Доступные межкомнатные двери</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <Footer/>
        </>
    );
};
