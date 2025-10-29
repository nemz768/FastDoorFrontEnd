import React, { useState } from "react";
import './stylesCalendar.css';
import {Availability} from "../../Interfaces/Interfaces";

interface CalendarTypeProps {
    selectedDate: string | null;
    setSelectedDate: (date: string) => void;
    onDateSelected: (date: string) => void;
    availabilityList: Availability[];
    fetchedAvailability: Availability[];
    canSelectClosedDays?: boolean;
    closedSelectedDates?: Set<string>;
    setClosedSelectedDates?: React.Dispatch<React.SetStateAction<Set<string>>>;
}


export const CustomCalendar = ({
                                   selectedDate,
                                   setSelectedDate,
                                   onDateSelected,
                                   availabilityList,
                                   fetchedAvailability,
                                   canSelectClosedDays = false,
                                   closedSelectedDates,
                                   setClosedSelectedDates,
                               }: CalendarTypeProps) => {
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
    const getMondayBasedWeekday = (date: Date):number => {
        const day = date.getDay();
        return day === 0 ? 6 : day - 1;
    };

    const firstDayOfWeek:number = getMondayBasedWeekday(new Date(currentYearMonth.year, currentYearMonth.month, 1));

    const availabilityMap: Record<string, {
        frontDoorQuantity: number;
        inDoorQuantity: number;
        available: boolean;
    }> = {};

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

    const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const onDayClick = (dateStr: string, isClosed: boolean, isPast: boolean) => {
        if (isPast) return;
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

        onDateSelected?.(dateStr);
        setSelectedDate?.(dateStr);
    };

    const renderDays = () => {
        const weeks = Math.ceil((firstDayOfWeek + daysInMonth) / 7);
        const days = [];
        let day = 1;

        // Сегодня (без времени)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = formatLocalDate(today);

        for (let week = 0; week < weeks; week++) {
            const weekDays = [];
            for (let dow = 0; dow < 7; dow++) {
                const index = week * 7 + dow;
                if (index < firstDayOfWeek || day > daysInMonth) {
                    weekDays.push(<div key={`empty-${index}`} className="calendar-day empty" />);
                } else {
                    const date = new Date(currentYearMonth.year, currentYearMonth.month, day);
                    const dateStr = formatLocalDate(date);

                    const isSelected = selectedDate === dateStr;
                    const isToday = dateStr === todayStr;
                    const isPast = date < today && !isToday;

                    const availability = availabilityMap[dateStr];
                    const isClosed = availability && !availability.available;
                    const isClosedSelected = closedSelectedDates?.has?.(dateStr);
                    const isUnavailable = !availability;

                    // === Логика для жёлтых дней (через 2–3 дня) ===
                    const diffTime = date.getTime() - today.getTime();
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    const isDayIn2to3 = diffDays === 2 || diffDays === 3;

                    weekDays.push(
                        <button
                            key={dateStr}
                            className={`calendar-day 
                            ${isSelected ? 'selected' : ''} 
                            ${isToday ? 'closedNotInstaller' : ''} 
                            ${isPast ? 'past' : ''} 
                            ${isClosed ? 'closed' : ''} 
                            ${isClosedSelected ? 'closed-selected' : ''} 
                            ${isUnavailable ? 'closedNotInstaller' : ''}
                            ${isDayIn2to3 ? 'highlight-2-3-days' : ''}
                            buttons-calendar`}
                            onClick={() => onDayClick(dateStr, isClosed, isPast)}
                            disabled={isPast || isToday || (isClosed && !canSelectClosedDays) || isUnavailable}
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
