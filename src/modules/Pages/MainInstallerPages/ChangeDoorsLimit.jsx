
import '../../../styles/styleMainInstaller/ChangeDoorLimits.css'


export const ChangeDoorsLimit = ({setOpenCalendarDateChange}) => {

    return (
        <div className="ChangeDoorsLimit">
            <div onClick={()=> {
                setOpenCalendarDateChange(false)
            }}>
                close
            </div>

            <div>
                <p>Входные двери: </p>
                <input type="text"/>
                <p>Межкомнатные двери: </p>
                <input type="text"/>
            </div>
        </div>
    );
};

