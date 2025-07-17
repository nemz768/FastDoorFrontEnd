import {Header} from "../../Widgets/Header/Header";
import {Popup} from "../../Widgets/Popup/Popup";
import './ReportPage.css'
import {Footer} from "../../Widgets/Footer/Footer";
import {useEffect, useState} from "react";
import {CustomCalendar} from "../../Widgets/CustomCalendar/CustomCalendar";
import Select, {MultiValue} from "react-select";

interface getReportTypes {
    dateFrom: string;
    dateTo: string;
    title: string;
}

type UserOption = {
    value: string;
    label: string;
};

export const ReportPage = () => {

    const usersOptions: UserOption[] = [
        { value: "user1", label: "БМ" },
    ];

    const [isAvaiable, setIsAvaiable] = useState<null | boolean>(null);

    const [getReports, setGetReports] = useState<getReportTypes[]>([]);

    const [selectedUsers, setSelectedUsers] = useState<MultiValue<UserOption>>([]);

    const navItems = [
        { label: "Главная", route: '/home/admin'  },
    ]


    const handleGetReports = async () => {
        try {
            const response = await fetch("/api/report/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            const data:getReportTypes[] = await response.json();
            console.log(data)
            setGetReports(data)
            setIsAvaiable(true);
        }
        catch (error:any)
        {
            console.error(error.message);
            setIsAvaiable(false);
        }
    }

    useEffect(() => {
        handleGetReports();
    }, [])


    return (
        <div className="ReportPage">
            <Header navItems={navItems}/>

            <section className="ReportPage-section">
                <div className="ReportPage-section-block">

                    {/*|| getReports.length !== 0*/}
                    {isAvaiable ? (
                        <div className="ReportPage-section-block-title">
                            <h1>Список отчетов пуст</h1>
                            <p>Создайте новый, чтобы получить доступ к списку отчетов</p>
                        </div>) :
                        (
                            <div className="ReportPage-section-block-title">
                                <h1>Список созданных отчетов</h1>
                                {getReports.map((report)=> (
                                    <div key={report.title} className="report">
                                        <ul>
                                            <li>{report.title}</li>
                                            <li>С {report.dateFrom} по {report.dateTo} </li>
                                        </ul>
                                    </div>
                                ))
                                }
                            </div>
                        )
                    }
                </div>
                <div className="ReportPage-section-block">
                    <h1>Создать новый отчет</h1>
                    <form className="flex flex-col gap-y-5">
                        <input className="border-1  bg-white h-10" type="text" />
                        <input  className="border-1  bg-white h-10" type="text"/>
                        <input   className="border-1  bg-white h-10" type="text" />

                        <Select
                            placeholder={"Выбрать необходимые магазины"}
                            isMulti
                            options={usersOptions}
                            value={selectedUsers}
                            onChange={setSelectedUsers}
                        />
                    </form>


                </div>

            </section>

            <Footer/>
            <Popup navItems={navItems}/>
        </div>
    );
};
