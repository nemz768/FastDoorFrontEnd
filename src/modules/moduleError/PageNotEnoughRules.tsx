import '../../styles/stylesError/pageNotEnoughRules.css';
import {Link, useNavigate} from "react-router-dom";
import image from  '../../assets/dog-family.jpg'




export const PageNotEnoughRules = () => {
    const navigate = useNavigate();

    return (
            <div className="page_403">
                <div className="page_403_info">
                    <h1>403</h1>
                    <p>Извините, но Вы вышли за рамки дозволенного!</p>
                 </div>
                <div className="page_403_info-img">
                    <img src={image} alt="z"/>
                    <button className="redirectBtn" onClick={()=> navigate(-1)}>Пожалуйста вернитесь назад и больше сюда не лезьте!</button>
                </div>
            </div>
    );
};

