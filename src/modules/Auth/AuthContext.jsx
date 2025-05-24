// AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [getRoles, setGetRoles] = useState(null);
    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, getRoles, setGetRoles }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);