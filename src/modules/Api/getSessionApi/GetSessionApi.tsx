import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const GetSessionApi = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/check-session', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.status === 401) {
                    navigate('/login');
                }
            } catch (err) {
                console.error("Ошибка проверки сессии:", err);
                navigate('/login');
            }
        };

        checkSession();
    }, [navigate]);

    return null;
};
