import {Header} from "../../Widgets/Header/Header";
import {Popup} from "../../Widgets/Popup/Popup";
import './ReportPage.css'
import {Footer} from "../../Widgets/Footer/Footer";
import {useEffect, useState} from "react";

export const ReportPage = () => {
    const [isAvaiable, setIsAvaiable] = useState<null | boolean>(null);

    const navItems = [
        { label: "Главная", route: '/home/admin'  },
    ]


    const handleGetReports = () => {
        setIsAvaiable(true);
    }

    useEffect(() => {
        handleGetReports();
    }, [])

    return (
        <div className="ReportPage">
            <Header navItems={navItems}/>
                <section>
                    {isAvaiable ? (<div>
                        <h1>Список отчетов пуст</h1>
                        <p>Создайте новый, чтобы получить доступ к списку отчетов</p>
                    </div>) :
                        (
                            <div>
                                <h1>Список созданных отчетов</h1>

                            </div>
                        )
                    }
                </section>

            <Footer/>
            <Popup navItems={navItems}/>
        </div>
    );
};
