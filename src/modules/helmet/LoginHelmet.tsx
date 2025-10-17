import {Helmet} from "react-helmet-async";

export const LoginHelmet = () => {
    return (
        <Helmet>
            <title>Вход — Fast-Door</title>
            <meta name="description" content="Авторизуйтесь для доступа к системе управления установщиками дверей" />
        </Helmet>
    );
};
