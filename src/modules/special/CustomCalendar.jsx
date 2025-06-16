import React, { useState } from "react";
import '../../styles/specialStyles/stylesCalendar.css';
//2
export const CustomCalendar = ({
                                   // selectedDate,
                                   // setSelectedDate,
                                   selectedDates,        // Множество выбранных дат (Set)
                                   setSelectedDates,     // Функция для обновления выбранных дат
                                   onDateSelected,
                                   availabilityList,
                                   fetchedAvailability,
                                   canSelectClosedDays = false,
                                   closedSelectedDates,
                                   setClosedSelectedDates,
                               }) => {
    const [currentYearMonth, setCurrentYearMonth] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    });

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ];
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const daysInMonth = new Date(currentYearMonth.year, currentYearMonth.month + 1, 0).getDate();
    const firstDayOfWeek = (new Date(currentYearMonth.year, currentYearMonth.month, 1).getDay() || 7) % 7;

    const availabilityMap = {};
    const dataSource = Array.isArray(fetchedAvailability) && fetchedAvailability.length > 0
        ? fetchedAvailability
        : (availabilityList || []);
    dataSource.forEach(day => {
        if (day && day.date) {
            availabilityMap[day.date] = {
                frontDoorQuantity: day.frontDoorQuantity || 0,
                inDoorQuantity: day.inDoorQuantity || 0,
                available: day.available !== undefined ? day.available : true,
            };
        }
    });

    const handlePrevMonth = () => {
        setCurrentYearMonth(prev => ({
            year: prev.month === 0 ? prev.year - 1 : prev.year,
            month: prev.month === 0 ? 11 : prev.month - 1,
        }));
        setClosedSelectedDates?.(new Set());
    };

    const handleNextMonth = () => {
        setCurrentYearMonth(prev => ({
            year: prev.month === 11 ? prev.year + 1 : prev.year,
            month: prev.month === 11 ? 0 : prev.month + 1,
        }));
        setClosedSelectedDates?.(new Set());
    };

    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const onDayClick = (dateStr, isClosed, isPast) => {
        if (isPast) return;

        // Если клик по закрытому дню и можно выбирать закрытые дни
        if (isClosed) {
            if (canSelectClosedDays && closedSelectedDates && setClosedSelectedDates) {
                setClosedSelectedDates(prev => {
                    const newSet = new Set(prev);
                    newSet.has(dateStr) ? newSet.delete(dateStr) : newSet.add(dateStr);
                    return newSet;
                });
            }
            return;
        }

        // Множественный выбор дат для открытия/закрытия
        if (selectedDates && setSelectedDates) {
            setSelectedDates(prev => {
                const newSet = new Set(prev);
                if (newSet.has(dateStr)) {
                    newSet.delete(dateStr);
                } else {
                    newSet.add(dateStr);
                }
                return newSet;
            });
        }

        // Для обратной совместимости
        onDateSelected?.(dateStr);
        // setSelectedDate?.(dateStr);  // Убрали одиночный выбор
    };

    const renderDays = () => {
        const weeks = Math.ceil((firstDayOfWeek + daysInMonth) / 7);
        const days = [];
        let day = 1;
        const todayStr = formatLocalDate(new Date());

        for (let week = 0; week < weeks; week++) {
            const weekDays = [];
            for (let dow = 0; dow < 7; dow++) {
                const index = week * 7 + dow;
                if (index < firstDayOfWeek || day > daysInMonth) {
                    weekDays.push(<div key={`empty-${index}`} className="calendar-day empty" />);
                } else {
                    const date = new Date(currentYearMonth.year, currentYearMonth.month, day);
                    const dateStr = formatLocalDate(date);
                    const isSelected = selectedDates ? selectedDates.has(dateStr) : false;
                    const isToday = dateStr === todayStr;
                    const isPast = date < new Date() && !isToday;
                    const availability = availabilityMap[dateStr];
                    const isClosed = availability && !availability.available;
                    const isClosedSelected = closedSelectedDates?.has?.(dateStr);

                    weekDays.push(
                        <button
                            key={dateStr}
                            className={`calendar-day 
                            ${isSelected ? 'selected' : ''} 
                            ${isToday ? 'today' : ''} 
                            ${isPast ? 'past' : ''} 
                            ${isClosed ? 'closed' : ''} 
                            ${isClosedSelected ? 'closed-selected' : ''} 
                            buttons-calendar`}
                            onClick={() => onDayClick(dateStr, isClosed, isPast)}
                            disabled={isPast || (isClosed && !canSelectClosedDays)}
                        >
                            <div className="day-number">{day}</div>
                            {availability && !isPast && (
                                <div className={`availability ${isPast ? 'past' : ''} ${isClosed ? 'closed' : ''}`}>
                                    <span>В: {availability.frontDoorQuantity}</span>
                                    <span>М: {availability.inDoorQuantity}</span>
                                </div>
                            )}
                        </button>
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
