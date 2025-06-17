import {useRef} from "react";
import '../../../styles/styleMainInstaller/ChangeDoorLimits.css'


export const ChangeDoorsLimit = ({selectedDate, setOpenCalendarDateChange}) => {

    const DoorLimits = {
        frontDoorQuantity: useRef(null),
        inDoorQuantity: useRef(null)
    }
    const patchDoorLimits = async () => {
        const frontDoorQuantity = DoorLimits.frontDoorQuantity.current.value;
        const inDoorQuantity = DoorLimits.inDoorQuantity.current.value;

        try {
            const response = await fetch("/api/doorLimits/editDate", {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date: selectedDate,
                    frontDoorQuantity: Number(frontDoorQuantity),
                    inDoorQuantity: Number(inDoorQuantity),
                    available: true
                })
            });

            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.log("Ошибка:", error);
        }
    };


    const handleConfirm = () =>  {
        patchDoorLimits();
        setOpenCalendarDateChange(false)

    }

    return (
        <div className="ChangeDoorsLimit">
            <div onClick={()=> {
                setOpenCalendarDateChange(false)
            }}>
                close
            </div>

            <div>
                <p>Входные двери: </p>
                <input ref={DoorLimits.frontDoorQuantity} type="text" />

                <p>Межкомнатные двери: </p>
                <input ref={DoorLimits.inDoorQuantity} type="text" />
                <button onClick={handleConfirm}>Подтвердить</button>
            </div>
        </div>
    );
};

