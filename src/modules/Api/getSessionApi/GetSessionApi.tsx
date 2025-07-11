import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {LogoutApi} from "../getLogoutApi/LogoutApi";

interface getSessionApiProps {
    isLoggedIn: null | boolean;
    setIsLoggedIn: (isLoggedIn: null | boolean) => void;
}

export const GetSessionApi = ({isLoggedIn, setIsLoggedIn}:getSessionApiProps) => {
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
                console.log(data)
                if (data.status === 401) {
                    setIsLoggedIn(false)
                    navigate('/login');
                }else {
                    setIsLoggedIn(true)
                }
            }
            catch(err) {
                console.log(err)
                setIsLoggedIn(false)
                navigate('/login');
            }
        }
        getSession()
    }, [])

    return isLoggedIn === true && <LogoutApi/>
}