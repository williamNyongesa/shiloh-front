import { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";

// Create AuthContext
export const AuthContext = createContext();

// Provider component to wrap around App
export const AuthProvider = ({ children }) => {
    // Initialize auth state (you might want to check localStorage or session here)
    const [auth, setAuth] = useState(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access to auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// ProtectedRoute component to handle route access based on role
export const ProtectedRoute = ({ children, role }) => {
    const { auth } = useAuth();

    // If no user is logged in or their role does not match, redirect to login
    if (!auth?.user || auth.role !== role) {
        return <Navigate to="/login" />;
    }
    return children;
};
