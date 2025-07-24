import {Header} from "../../Widgets/Header/Header";
import {Popup} from "../../Widgets/Popup/Popup";
import './ReportPage.css'
import {Footer} from "../../Widgets/Footer/Footer";
import {useEffect, useState} from "react";
import Select, {MultiValue} from "react-select";
import RangeCalendar from "./RangeCalendar";


interface getReportTypes {
    dateFrom: string;
    dateTo: string;
    title: string;
    relatedUser: string[];
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

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const [title, setTitle] = useState("");

    const navItems = [
        { label: "Главная", route: '/home/owner'  },
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


    const postReport = async (e:any) => {
        e.preventDefault();
        if (!title || !dateRange[0] || !dateRange[1] || selectedUsers.length === 0) {
            alert("Пожалуйста, заполните все поля");
            return;
        }

        // const payload = {
        //     title: title,
        //     dateFrom: dateRange[0].toISOString(),
        //     dateTo: dateRange[1].toISOString(),
        //     relatedUser: selectedUsers.map(u => u.value),
        // }

        try {
        const response = await fetch("/api/report/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: 'title',
                dateFrom: "2025-1-1",
                dateTo: "2025-2-2",
                relatedUser: ["БМ"],
            })
        })
            const data = await response.json();
            console.log(data)

        }
        catch(err: any) {
            console.log(err)
        }
    }


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
                <div className="ReportPage-section-block bg-gray-200 mt-10 mb-10 rounded-4xl">
                    <h1>Создать новый отчет</h1>
                    <form onSubmit={(e)=> postReport(e)} className="flex flex-col gap-y-5">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Введите title..."
                                required
                                className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white h-12 pl-3 rounded"
                                type="text" />
                        <Select
                            required
                            placeholder={"Выбрать необходимые магазины"}
                            isMulti
                            options={usersOptions}
                            value={selectedUsers}
                            onChange={setSelectedUsers}
                        />
                            <RangeCalendar
                                value={dateRange}
                                onChange={setDateRange}
                            />
                       <button className=" group bg-[#E9D6C7] w-50 h-20 center-block hover:bg-[#4E3629] transition-colors duration-300 px-4 py-2 rounded mx-auto block">
                            <span className="text-black group-hover:text-white">Создать отчет</span>
                        </button>
                    </form>

                </div>

            </section>

            <Footer/>
            <Popup navItems={navItems}/>
        </div>
    );
};
