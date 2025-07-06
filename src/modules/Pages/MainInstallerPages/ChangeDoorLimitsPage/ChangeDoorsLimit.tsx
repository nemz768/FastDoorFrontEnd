import {useEffect, useState} from "react";
import './ChangeDoorLimits.css'


interface ChangeDoorsLimitsProps {
    frontDoorQuantity: number;
    inDoorQuantity: number;
    selectedDate: string | null;
    setOpenCalendarDateChange: (value: boolean) => void;
    refreshAvailabilityData: () => void;

}



export const ChangeDoorsLimit = ({frontDoorQuantity, inDoorQuantity, selectedDate, setOpenCalendarDateChange,refreshAvailabilityData }: ChangeDoorsLimitsProps) => {

    const [frontDoorQuantityValue, setFrontDoorQuantityValue] = useState(frontDoorQuantity);
    const [inDoorQuantityValue, setInDoorQuantityValue] = useState(inDoorQuantity);


    useEffect(() => {
        setFrontDoorQuantityValue(frontDoorQuantity)
        setInDoorQuantityValue(inDoorQuantity)
    }, [frontDoorQuantity, inDoorQuantity])



    const patchDoorLimits = async () => {
        try {
            const response = await fetch("/api/doorLimits/editDate", {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: selectedDate,
                    frontDoorQuantity: frontDoorQuantityValue,
                    inDoorQuantity: inDoorQuantityValue,
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
        <div className="ChangeDoorsLimit">
            <div onClick={()=> {
                setOpenCalendarDateChange(false)
            }}>
                close
            </div>
            <div>
                <p>Входные двери: </p>
                <input min="0"   value={frontDoorQuantityValue} onChange={(e)=> setFrontDoorQuantityValue(Number(e.target.value))} type="number" />

                <p>Межкомнатные двери: </p>
                <input min="0"  value={inDoorQuantityValue} onChange={(e)=> setInDoorQuantityValue(Number(e.target.value))} type="number" />
                <button onClick={patchDoorLimits}>Подтвердить</button>
            </div>
        </div>
    );
};

