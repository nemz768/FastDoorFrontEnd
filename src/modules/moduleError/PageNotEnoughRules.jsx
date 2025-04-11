import '../../styles/stylesError/pageNotEnoughRules.css';

export const PageNotEnoughRules = () => {
    return (
            <div className="page_403">
                <div className="page_box">
                    <h1>403</h1>
                    <p>Извините, но Вы вышли за рамки дозволенного!</p>
                    <p><a href="javascript:history.back()">Пожалуйста вернитесь назад и больше сюда не лезьте!</a></p>
                </div>
            </div>
    );
};

