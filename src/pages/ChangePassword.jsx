import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/api'; // Import the changePassword API call
import { useAuth } from '../contexts/AuthContext'; // To get current user ID and logout function

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // Destructure user and logout

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        if (newPassword !== confirmNewPassword) {
            setError('New password and confirmation do not match.');
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) { // Basic client-side validation for password strength
            setError('New password must be at least 8 characters long.');
            setLoading(false);
            return;
        }

        // Ensure user is authenticated and has an ID
        if (!user || !user.id) {
            setError('Authentication error: User ID not found. Please log in again.');
            setLoading(false);
            logout(); // Clear potentially stale auth state
            navigate('/'); // Redirect to login
            return;
        }

        try {
            const userId = user.id; // Get the user's ID from the authenticated user object
            await changePassword(userId, { // Call the API service function
                currentPassword,
                newPassword
            });
            setMessage('Password changed successfully! You will be redirected to login.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');

            // Redirect to login after a short delay for security and confirmation
            setTimeout(() => {
                logout(); // Log out the user to force re-login with new password
                navigate('/'); // Navigate to the login page
            }, 2000); // 2-second delay

        } catch (err) {
            console.error("Password change failed:", err);
            setError(err.response?.data?.message || err.message || 'Failed to change password. Please check your current password and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-gray-200 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 leading-tight">Change Password</h2>

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
                        <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            placeholder="••••••••"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition duration-200"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
