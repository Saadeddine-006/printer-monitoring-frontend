import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as loginApi } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, user, authReady } = useAuth(); // Destructure user and authReady

    // New useEffect to handle navigation after authentication state is ready
    useEffect(() => {
        console.log("LOGIN_COMPONENT useEffect: user changed:", user ? "Exists" : "Null", "authReady:", authReady);
        // Only navigate if authReady is true AND user is authenticated
        if (authReady && user) {
            console.log("LOGIN_COMPONENT useEffect: Auth is ready and user exists. Navigating to /dashboard.");
            navigate('/dashboard');
        }
    }, [user, authReady, navigate]); // Depend on user, authReady, and navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        console.log("LOGIN_COMPONENT: Submit button clicked. Attempting login...");
        try {
            const response = await loginApi({ email, password });
            console.log("LOGIN_COMPONENT: API login call succeeded! Response:", response);

            login(response); // This will set the token in AuthContext, triggering its useEffect
            console.log("LOGIN_COMPONENT: AuthContext login function was called with response. Waiting for state update...");

            // Removed direct navigate('/dashboard') here.
            // The useEffect above will handle navigation once user and authReady are set.

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            console.error("LOGIN_COMPONENT: Login failed caught in catch block:", errorMessage, err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold mb-7 text-center text-gray-900">Sign In</h2>
                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-5 border border-red-200">
                        {error}
                    </p>
                )}
                <div className="mb-5">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ease-in-out"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transform hover:scale-105 transition duration-300 ease-in-out shadow-md"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
