import {Header} from "../../Widgets/Header/Header";
import {Popup} from "../../Widgets/Popup/Popup";
import './ReportPage.css'
import {Footer} from "../../Widgets/Footer/Footer";
import React, {useEffect, useState} from "react";
import Select, {MultiValue} from "react-select";
import RangeCalendar from "./RangeCalendar";


interface getReportTypes {
    id: number;
    dateFrom: string;
    dateTo: string;
    title: string;
    relatedUsers: string[];
}

type UserOption = {
    label: string;
};


export const ReportPage = () => {

    const usersOptions: UserOption[] = [
        {  label: "бм" },
    ];

    const [isAvaiable, setIsAvaiable] = useState<null | boolean>(null);

    const [getReports, setGetReports] = useState<getReportTypes[]>([]);

    const [selectedUsers, setSelectedUsers] = useState<MultiValue<UserOption>>([]);

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const [title, setTitle] = useState("");

    const [formError, setFormError] = useState({
        title: false,
        dateRange: false,
        selectedUsers: false,
    });


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



    const getDownloadFile = async (reportId:number, fileName:string) => {

        try {
            const response = await fetch(`/api/report/download?reportId=${reportId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName.replace("admin", "")}.xls`; // имя файла
            document.body.appendChild(link);
            link.click();
            link.remove();


            window.URL.revokeObjectURL(url);
        }
        catch (error:any) {
            console.error("Ошибка загрузки:", error.message);
        }

    }


    useEffect(() => {
        handleGetReports();
    }, [])


    const postReport = async (e: React.FormEvent) => {
        e.preventDefault();


        const error = {
            title: !title,
            dateRange: !dateRange[0] || !dateRange[1],
            selectedUsers: selectedUsers.length === 0,
        }
        setFormError(error);

        const hasErrors = Object.values(error).some(Boolean);
        if (hasErrors) return;

        if (!title || !dateRange[0] || !dateRange[1] || selectedUsers.length === 0) {
            alert("Пожалуйста, заполните все поля");
            return;
        }

        const payload = {
            title: title,
            dateFrom: dateRange[0].toISOString().split('T')[0],
            dateTo: dateRange[1].toISOString().split('T')[0],
            relatedUsers: selectedUsers.map(u => u.label),
        }

        console.log(payload)

        try {
        const response = await fetch("/api/report/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })
            const data = await response.text();
            console.log(data)
            await handleGetReports();
        }
        catch(err: any) {
            console.log(err)
        }
    }




    // Форматирование даты в DD.MM.YYYY
    const reversedDate = (dateString: string) => {
        if (dateString.length < 10) return '';
        const day = dateString.slice(8, 10);
        const month = dateString.slice(5, 7);
        const year = dateString.slice(0, 4);
        if (!day || !month || !year) return '';
        return `${day}.${month}.${year}`;
    };


    return (
        <div className="ReportPage">
            <Header navItems={navItems}/>

            <section className="ReportPage-section">
                <div className="ReportPage-section-block">
                    {!isAvaiable || getReports.length === 0 ? (
                        <div className="ReportPage-section-block-title">
                            <h1>Список отчетов пуст</h1>
                            <p>Создайте новый, чтобы получить доступ к списку отчетов</p>
                        </div>) :
                        (
                            <div className="ReportPage-section-block-title p-6 bg-white rounded-2xl shadow-md">
                                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Список созданных отчетов</h1>
                                <div className="space-y-4">
                                    {getReports.map((report) => (
                                        <div
                                            key={report.title}
                                            className="report border border-gray-200 rounded-lg p-4 hover:shadow transition duration-200 bg-gray-50"
                                        >
                                            <ul className="space-y-1 text-gray-700">
                                                <li className="text-lg font-medium">{report.title.replace("admin", "")}</li>
                                                <li className="text-sm text-gray-500">
                                                    С {reversedDate(report.dateFrom)} по {reversedDate(report.dateTo)}
                                                </li>
                                            </ul>
                                            <div className="mt-2">
                                                <button
                                                    onClick={() => getDownloadFile(report.id, report.title)}
                                                    className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition"
                                                >
                                                    Скачать отчёт
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        )
                    }
                </div>
                <div className="ReportPage-section-block bg-gray-200 mt-10 mb-10 rounded-4xl">
                    <h1>Создать новый отчет</h1>
                    <form onSubmit={postReport} className="flex flex-col gap-y-5">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={formError.title ? "Введите название отчета" : "Введите title..."}
                            className={`border ${formError.title ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white h-12 pl-3 rounded`}
                            type="text"
                        />
                        <Select
                            placeholder={formError.selectedUsers ? "Выберите магазины (обязательно)" : "Выбрать необходимые магазины"}
                            isMulti
                            options={usersOptions}
                            value={selectedUsers}
                            onChange={(value) => {
                                setSelectedUsers(value);
                                if (value.length > 0) {
                                    setFormError(prev => ({ ...prev, selectedUsers: false }));
                                }
                            }}
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    borderColor: formError.selectedUsers ? "red" : base.borderColor,
                                    boxShadow: formError.selectedUsers ? "0 0 0 1px red" : state.isFocused ? "0 0 0 1px #2563eb" : base.boxShadow,
                                    '&:hover': {
                                        borderColor: formError.selectedUsers ? "red" : base.borderColor,
                                    },
                                }),
                            }}
                        />

                        <div className={formError.dateRange ? "border border-red-500 p-2 rounded" : ""}>
                            <RangeCalendar
                                value={dateRange}
                                onChange={(val) => {
                                    setDateRange(val);
                                    if (val[0] && val[1]) {
                                        setFormError(prev => ({ ...prev, dateRange: false }));
                                    }
                                }}
                            />
                        </div>

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
