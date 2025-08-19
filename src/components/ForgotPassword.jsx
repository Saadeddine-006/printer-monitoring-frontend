import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api.js'; // Import forgotPassword API call

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            // Send the email directly in the request body as a string, as per backend endpoint
            const response = await forgotPassword(email);
            setMessage(response || "Password reset link sent to your email (if account exists).");
            setEmail(''); // Clear the email field
        } catch (err) {
            console.error("Forgot password request failed:", err);
            setError(err.response?.data?.message || err.message || "Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-200 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 leading-tight">Forgot Password?</h2>
                <p className="text-gray-600 text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {message && (
                    <p className="bg-green-100 text-green-700 p-3 rounded-lg text-center mb-4 border border-green-200 animate-fade-in">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4 border border-red-200 animate-fade-in">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition duration-200"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
