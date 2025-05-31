import React from 'react';
import {Header} from "../../Header.jsx";

export const InstallersList = () => {


    const navItems = [
        { label: 'Главная', route: '/home/mainInstaller/' },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
        { label: 'Список заказов', route: '/404' },
     ];


    return (
        <div>
            <Header navItems={navItems} />
            <div className="admin-panel">
                <table className="MainInstallerPage__block">
                    <thead>
                    <tr>
                        <th>Фио Установщика</th>
                        <th>Номер телефона</th>
                        <th>Действие</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <p></p>
                        </td>
                        <td>
                            <p></p>
                        </td>
                        <td>
                            <button>Изменить</button>
                            <button>Удалить</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

    );
};

