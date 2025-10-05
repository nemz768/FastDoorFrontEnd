import {useEffect, useState} from "react";

import './ChangeDoorsLimit.scss';

import xSymbol from '../../../../public/x-symbol.svg'

interface ChangeDoorsLimitsProps {
    frontDoorQuantity: number;
    inDoorQuantity: number;
    selectedDate: string | null;
    setOpenCalendarDateChange: (value: boolean) => void;
    refreshAvailabilityData: () => void;

}

export const ChangeDoorsLimit = ({frontDoorQuantity, inDoorQuantity, selectedDate, setOpenCalendarDateChange,refreshAvailabilityData }: ChangeDoorsLimitsProps) => {

    const [frontDoorQuantityValue, setFrontDoorQuantityValue] = useState(frontDoorQuantity.toString());
    const [inDoorQuantityValue, setInDoorQuantityValue] = useState(inDoorQuantity.toString());


    useEffect(() => {
        setFrontDoorQuantityValue(frontDoorQuantity.toString());
        setInDoorQuantityValue(inDoorQuantity.toString())
    }, [frontDoorQuantity, inDoorQuantity])

    const validateCountOfDoors = (InputValue: string, setValue: (val: string) => void) => {
        if (InputValue === "") {
            setValue("0"); // если удалили всё — ставим 0
            return;
        }
        const cleaned = InputValue.replace(/^0+/, "") || "0";
        setValue(cleaned);
    }

    const patchDoorLimits = async () => {
        try {
            const response = await fetch("/api/doorLimits/editDate", {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: selectedDate,
                    frontDoorQuantity: Number(frontDoorQuantityValue),
                    inDoorQuantity: Number(inDoorQuantityValue),
                    available: true,
                })
            });

            const data = await response.text();
            console.log(data);
            await refreshAvailabilityData();
            setOpenCalendarDateChange(false)

        } catch (error) {
            console.log("Ошибка:", error);
        }
    };
    return (
        <div className="change-doors-limit">
            <div className="change-doors-limit__close" onClick={() => setOpenCalendarDateChange(false)}>
                <img src={xSymbol} alt="X" />
            </div>

            <div className="change-doors-limit__inputs">
                <div>
                    <p>Входные двери:</p>
                    <input
                        min="0"
                        step={1}
                        value={frontDoorQuantityValue}
                        onChange={(e) => validateCountOfDoors(e.target.value, setFrontDoorQuantityValue)}
                        type="number"
                    />
                </div>

                <div>
                    <p>Межкомнатные двери:</p>
                    <input
                        min="0"
                        step={1}
                        value={inDoorQuantityValue}
                        onChange={(e) => validateCountOfDoors(e.target.value, setInDoorQuantityValue)}
                        type="number"
                    />
                </div>

                <button className="change-doors-limit__button" onClick={patchDoorLimits}>
                    Изменить
                </button>
            </div>
        </div>

    );
};

