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



    const disabledDatesSet = useMemo(() => new Set(disabledDates), [disabledDates]);



    const tileDisabled = ({ date, view }: { date: Date; view: string }): boolean => {
        if (view !== "month") return false;

        const formatted = date.toISOString().slice(0, 10);

        return disabledDatesSet.has(formatted);
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
