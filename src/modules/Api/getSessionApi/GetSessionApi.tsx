import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface GetSessionApiProps {
    setIsLoggedIn: (value: boolean) => void;
}

export const GetSessionApi = ({ setIsLoggedIn }: GetSessionApiProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        const getSession = async () => {
            try {
                const response = await fetch('/api/check-session', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                const data = await response.json();
                console.log(data);

                if (data.status === 401) {
                    setIsLoggedIn(false);
                    navigate('/login');
                } else {
                    setIsLoggedIn(true);
                }
            } catch (err) {
                console.log(err);
                setIsLoggedIn(false);
                navigate('/login');
            }
        };

        getSession();
    }, [navigate, setIsLoggedIn]);

    return null;
};
