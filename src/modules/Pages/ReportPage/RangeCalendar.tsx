import React, {useMemo} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./RangeCalendar.css"; // создаём кастомные стили


interface RangeCalendarProps {
    value: [Date | null, Date | null];
    onChange: (value: [Date, Date]) => void;
    disabledDates?: string[];


}

const RangeCalendar: React.FC<RangeCalendarProps> = ({ value, onChange, disabledDates = [] }) => {
    const tileClassName = ({ date, view }: any) => {
        if (view === "month" && value[0] && value[1]) {
            const [start, end] = value;
            if (start && end && date >= start && date <= end) {
                return "highlight";
            }
        }
        return null;
    };

    const formatDateLocal = (date: Date): string => {
        // Получаем год, месяц и день из локальной даты
        const year = date.getFullYear();
        // getMonth() возвращает 0-11, добавляем 1 и дополняем до 2 символов
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const disabledDatesSet = useMemo(() => new Set(disabledDates), [disabledDates]);



    const tileDisabled = ({ date, view }: { date: Date; view: string }): boolean => {
        if (view !== "month") return false;

        const formatted = formatDateLocal(date)

        return !disabledDatesSet.has(formatted);
    };



    return (
        <div className="calendar-wrapper">
            <Calendar
                onChange={(val) => onChange(val as [Date, Date])}
                value={value}
                selectRange={true}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                prevLabel="‹"
                nextLabel="›"
                formatShortWeekday={(locale, date) =>
                    ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][date.getDay()]
                }
                locale="ru-RU"
            />
        </div>
    );
};

export default RangeCalendar;
