import React, {useEffect, useState} from 'react';
import {Header} from "../../Header.jsx";
import {Footer} from "../../Footer.jsx";
import '../../../styles/styleMainInstaller/installers.css'



export const InstallersList = () => {
    const [installers, setInstallers] = useState([]);


    const navItems = [
        { label: 'Главная', route: '/home/mainInstaller/' },
        { label: 'Добавить установщика', route: '/home/mainInstaller/create' },
        { label: 'Список заказов', route: '/404' },
     ];

    useEffect(()=> {
        const getInstallers = async () => {
            try {
                const response = await fetch("/api/listInstallers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                const data = await response.json();
                setInstallers(data.installers.map((item) => (
                    {...item,}
                )));
                console.log(data)

            }
            catch (error) {
                console.log(error);
            }
        }
        getInstallers()
    }, [])

    return (
        <div>
            <Header navItems={navItems} />
            <div className="admin-panel">
                <table className="installers-table">
                    <thead>
                    <tr>
                        <th>Фио Установщика</th>
                        <th>Номер телефона</th>
                        <th>Действие</th>
                    </tr>
                    </thead>
                    <tbody>
                    {installers.map((item) => (
                        <tr key={item.id}>
                            <td>{item.fullName}</td>
                            <td>{item.phone}</td>
                            <td>
                                <button>Изменить</button>
                                <button>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Footer />
        </div>

    );
};

