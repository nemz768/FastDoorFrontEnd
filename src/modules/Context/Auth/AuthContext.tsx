import { createContext, useContext, useState, useEffect, ReactNode  } from 'react';

interface AuthContextType  {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProps {
    children: ReactNode
}

export const AuthProvider = ({ children }:AuthContextProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Проверяем авторизацию при монтировании
    useEffect(() => {
        const storedRoles = localStorage.getItem('userRoles');
        if (storedRoles && (storedRoles === 'administrator' || storedRoles === 'salespeople' || storedRoles === "main")) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}