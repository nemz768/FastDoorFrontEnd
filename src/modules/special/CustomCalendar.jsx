import React, { useEffect, useState } from "react";

export const CustomCalendar = ({ availabilityList, onDateSelected, selectedDate }) => {
    const [fetchedAvailability, setFetchedAvailability] = useState(availabilityList || []);

    useEffect(() => {
        const showCountOfDoors = async () => {
            try {
                const res = await fetch("/api/orders/create", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                // Ensure data.availabilityList is an array; fallback to empty array if not
                const availabilityData = Array.isArray(data.availabilityList) ? data.availabilityList : [];
                setFetchedAvailability(availabilityData);
                console.log("Fetched availability:", availabilityData);
            } catch (err) {
                console.error("Error fetching availability:", err);
                setFetchedAvailability(availabilityList || []); // Fallback to prop data on error
            }
        };
        showCountOfDoors();
    }, [availabilityList]); // Add availabilityList as dependency to re-fetch if prop changes

    const today = new Date();
    const [currentYearMonth, setCurrentYearMonth] = useState({
        year: today.getFullYear(),
        month: today.getMonth(),
    });

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ];
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const daysInMonth = new Date(currentYearMonth.year, currentYearMonth.month + 1, 0).getDate();
    const firstDayOfWeek = (new Date(currentYearMonth.year, currentYearMonth.month, 1).getDay() || 7) % 7;

    const availabilityMap = {};
    // Use fetchedAvailability if available, otherwise fallback to availabilityList
    const dataSource = fetchedAvailability.length > 0 ? fetchedAvailability : (availabilityList || []);
    dataSource.forEach(day => {
        if (day && day.date) { // Ensure day and day.date exist
            availabilityMap[day.date] = {
                frontDoorQuantity: day.frontDoorQuantity || 0,
                inDoorQuantity: day.inDoorQuantity || 0,
            };
        }
    });

    const handlePrevMonth = () => {
        setCurrentYearMonth(prev => ({
            year: prev.month === 0 ? prev.year - 1 : prev.year,
            month: prev.month === 0 ? 11 : prev.month - 1,
        }));
    };

    const handleNextMonth = () => {
        setCurrentYearMonth(prev => ({
            year: prev.month === 11 ? prev.year + 1 : prev.year,
            month: prev.month === 11 ? 0 : prev.month + 1,
        }));
    };

    const renderDays = () => {
        const weeks = Math.ceil((firstDayOfWeek + daysInMonth) / 7);
        const days = [];
        let day = 1;
        const todayStr = today.toISOString().split('T')[0];

        for (let week = 0; week < weeks; week++) {
            const weekDays = [];
            for (let dow = 0; dow < 7; dow++) {
                const index = week * 7 + dow;
                if (index < firstDayOfWeek || day > daysInMonth) {
                    weekDays.push(<div key={`empty-${index}`} className="calendar-day empty" />);
                } else {
                    const date = new Date(currentYearMonth.year, currentYearMonth.month, day);
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateStr;
                    const isToday = dateStr === todayStr;
                    const isPast = date < today && !isToday;
                    const availability = availabilityMap[dateStr];

                    weekDays.push(
                        <div
                            key={dateStr}
                            className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
                            onClick={isPast ? undefined : () => onDateSelected(dateStr)}
                        >
                            <div className="day-number">{day}</div>
                            {availability && (
                                <div className={`availability ${isPast ? 'past' : ''}`}>
                                    <span>В: {availability.frontDoorQuantity}</span>
                                    <span>М: {availability.inDoorQuantity}</span>
                                </div>
                            )}
                        </div>
                    );
                    day++;
                }
            }
            days.push(<div key={`week-${week}`} className="calendar-week">{weekDays}</div>);
        }
        return days;
    };

    return (
        <div className="custom-calendar">
            <div className="calendar-header">
                <span onClick={handlePrevMonth} className="nav-arrow">{'<'}</span>
                <span>{`${monthNames[currentYearMonth.month]} ${currentYearMonth.year}`}</span>
                <span onClick={handleNextMonth} className="nav-arrow">{'>'}</span>
            </div>
            <div className="calendar-weekdays">
                {dayNames.map((day, index) => (
                    <div key={index} className="weekday">{day}</div>
                ))}
            </div>
            <div className="calendar-days">{renderDays()}</div>
        </div>
    );
};