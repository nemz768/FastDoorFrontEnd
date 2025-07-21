import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./RangeCalendar.css"; // создаём кастомные стили


interface RangeCalendarProps {
    value: [Date | null, Date | null];
    onChange: (value: [Date, Date]) => void;
}

const RangeCalendar: React.FC<RangeCalendarProps> = ({ value, onChange }) => {
    const tileClassName = ({ date, view }: any) => {
        if (view === "month" && value[0] && value[1]) {
            const [start, end] = value;
            if (start && end && date >= start && date <= end) {
                return "highlight";
            }
        }
        return null;
    };

    return (
        <div className="calendar-wrapper">
            <Calendar
                onChange={(val) => onChange(val as [Date, Date])}
                value={value}
                selectRange={true}
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
