import React, { createContext, useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            const decodedUser = JSON.parse(savedUser); 
            setToken(savedToken);
            setUser(decodedUser);
        }
    }, []);

    const login = (access_token, userData) => {
        const { username, role } = userData; 

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify({ username, role }));

        setToken(access_token);
        setUser({ username, role });  
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
    };

    const isAuthenticated = () => !!token;

    return (
        <AuthContext.Provider value={{
            user, token, login, logout, isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated() || (requiredRole && user?.role !== requiredRole)) {
        return <Navigate to="/login" />;
    }
    return children;
}