import '../../styles/stylesError/pageNotEnoughRules.css';
import {useNavigate} from "react-router-dom";

export const PageNotEnoughRules = () => {
    const navigate = useNavigate();

    return (
            <div className="page_403">
                <div className="page_box">
                    <h1>403</h1>
                    <p>Извините, но Вы вышли за рамки дозволенного!</p>
                    <p style={{cursor: "pointer"}}><a onClick={()=> navigate(-1)}>Пожалуйста вернитесь назад и больше сюда не лезьте!</a></p>
                    <img src="../../assets/dog-family.jpg" alt="z"/>
                </div>
            </div>
    );
};

