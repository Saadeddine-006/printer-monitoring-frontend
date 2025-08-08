import { createContext, useState, useContext, useEffect } from 'react';
import { setAuthToken } from '../services/apiClient'; // For setting Axios default header
import apiClient from '../services/apiClient'; // For actual API calls

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize token from localStorage if available
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    // User state, initially null
    const [user, setUser] = useState(null);
    // Flag to indicate if the initial authentication check (from token in localStorage) is complete
    const [authReady, setAuthReady] = useState(false);

    // --- Logout Function ---
    const logout = () => {
        console.log("AUTH_CONTEXT: Initiating logout...");
        setToken(null); // Clear token from state
        setUser(null);  // Clear user from state
        localStorage.removeItem('authToken'); // Remove token from local storage
        setAuthToken(null); // Clear token from Axios default headers
        setAuthReady(true); // After logout, the auth check is complete (no user)
        console.log("AUTH_CONTEXT: Logout complete. Auth state reset.");
    };

    // --- Effect for initial auth check or when token changes ---
    // This useEffect is now the SINGLE source of truth for 'user' and 'authReady' states.
    // When 'token' changes (either on initial load or after login/logout), this effect runs.
    useEffect(() => {
        const checkAuthStatus = async () => {
            console.log("AUTH_CONTEXT: useEffect triggered to check auth status. Current Token State:", token ? "Exists" : "Null");
            if (token) {
                setAuthToken(token); // Set token for Axios instance
                try {
                    // Attempt to fetch user profile using the token
                    const response = await apiClient.get('/auth/me');
                    setUser(response.data); // Set user data if successful
                    console.log("AUTH_CONTEXT: User data fetched successfully on load/token change. User:", response.data);
                } catch (error) {
                    console.error("AUTH_CONTEXT: Failed to fetch user data with token, logging out.", error);
                    // If fetching user fails (e.g., invalid/expired token), perform logout
                    logout();
                }
            } else {
                setAuthToken(null); // Ensure no token is set in Axios if state token is null
                console.log("AUTH_CONTEXT: No token found or token cleared. User is not authenticated.");
            }
            // IMPORTANT: Set authReady to true regardless of success or failure.
            // This indicates that the initial authentication check process has completed,
            // even if no user was found.
            setAuthReady(true);
            console.log("AUTH_CONTEXT: Initial authentication check complete. authReady set to TRUE.");
        };

        // Call the function immediately when the effect runs
        checkAuthStatus();
    }, [token]); // Dependency array: run this effect whenever 'token' changes

    // --- Login Function ---
    // This function now ONLY sets the 'token' state.
    // The 'useEffect' above will then react to this 'token' change and
    // proceed to fetch the 'user' data and set 'authReady'.
    const login = (data) => {
        console.log("AUTH_CONTEXT: Login function called to set token in state & local storage. Data received:", data);
        setToken(data.token); // Update token state (triggers useEffect)
        localStorage.setItem('authToken', data.token); // Store token in local storage
        setAuthToken(data.token); // Set token for Axios for immediate use in other components
        // Do NOT set user or authReady directly here. Let useEffect handle it.
        console.log("AUTH_CONTEXT: Login function finished. Token state updated. User and authReady will update via useEffect.");
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, authReady }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
