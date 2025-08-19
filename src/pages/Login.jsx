import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as loginApi } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, user, authReady } = useAuth();

    useEffect(() => {
        console.log("LOGIN_COMPONENT useEffect: user changed:", user ? "Exists" : "Null", "authReady:", authReady);
        if (authReady && user) {
            console.log("LOGIN_COMPONENT useEffect: Auth is ready and user exists. Navigating to /dashboard.");
            navigate('/dashboard');
        }
    }, [user, authReady, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        console.log("LOGIN_COMPONENT: Submit button clicked. Attempting login...");
        try {
            const response = await loginApi({ email, password });
            console.log("LOGIN_COMPONENT: API login call succeeded! Response:", response);

            login(response);
            console.log("LOGIN_COMPONENT: AuthContext login function was called with response. Waiting for state update...");

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            console.error("LOGIN_COMPONENT: Login failed caught in catch block:", errorMessage, err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-200 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 leading-tight">Welcome Back!</h2>

                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-6 border border-red-200 animate-fade-in">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-102"
                    >
                        Login
                    </button>
                    {/* New: Forgot Password Link */}
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md p-1"
                        >
                            Forgot password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
