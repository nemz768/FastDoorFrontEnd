import {useState} from "react";
import '../../../styles/styleMainInstaller/ChangeDoorLimits.css'

export const ChangeDoorsLimit = ({selectedDate, setOpenCalendarDateChange }) => {

    const [frontDoorQuantity, setFrontDoorQuantity] = useState(0);
    const [inDoorQuantity, setInDoorQuantity] = useState(0);


    const patchDoorLimits = async () => {
        try {
            const response = await fetch("/api/doorLimits/editDate", {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: selectedDate,
                    frontDoorQuantity: frontDoorQuantity,
                    inDoorQuantity: inDoorQuantity,

                })
            });

            const data = await response.text();
            console.log(data);


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
                <input value={frontDoorQuantity} onChange={(e)=> setFrontDoorQuantity(Number(e.target.value))}type="text" />

                <p>Межкомнатные двери: </p>
                <input value={inDoorQuantity} onChange={(e)=> setInDoorQuantity(Number(e.target.value))} type="text" />
                <button onClick={patchDoorLimits}>Подтвердить</button>
            </div>
        </div>
    );
};

