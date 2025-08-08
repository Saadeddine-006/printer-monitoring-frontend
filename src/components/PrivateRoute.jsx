import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React, { useEffect } from 'react';

const PrivateRoute = ({ children }) => {
    const { user, authReady } = useAuth();

    useEffect(() => {
        console.log("PRIVATE_ROUTE: Mounted/Re-rendered. authReady:", authReady, "User exists:", !!user);
    }, [authReady, user]);


    if (!authReady) {
        console.log("PRIVATE_ROUTE: Auth is NOT ready, showing loading state.");
        return <p>Loading authentication...</p>; // Or a spinner/loading component
    }

    if (!user) {
        console.log("PRIVATE_ROUTE: Auth is ready but NO user found. Redirecting to /.");
        return <Navigate to="/" replace />;
    }

    console.log("PRIVATE_ROUTE: Auth is ready AND user found. Rendering children.");
    return children;
};

export default PrivateRoute;
