import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient'; // For fetching profile

const Profile = () => {
    const { user, authReady } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!authReady || !user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get('/users/profile'); // Fetch profile from backend
                setUserProfile(response.data);
                console.log("PROFILE_PAGE: User Profile fetched successfully:", response.data);
            } catch (err) {
                console.error("PROFILE_PAGE: Error fetching user profile:", err);
                setError('Failed to load user profile. Please try again.');
                // If profile fetch fails, user might be authenticated but token expired or invalid
                // Optionally logout or redirect
                // logout(); // Consider logging out if the error is severe
                navigate('/'); // Redirect to login
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, authReady, navigate]);

    const handleChangePasswordClick = () => {
        navigate('/change-password');
    };

    if (loading || !authReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="text-center text-xl font-semibold text-gray-700 p-10 bg-white rounded-2xl shadow-xl animate-pulse">
                    <div className="flex items-center justify-center space-x-3">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading profile...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !user || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-5 rounded-2xl shadow-xl text-center max-w-sm w-full" role="alert">
                    <strong className="font-bold text-xl block mb-2">Error!</strong>
                    <span className="block text-lg sm:inline ml-2">{error || 'User profile not found or authentication required.'}</span>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-300">
            {/* Sidebar will be rendered in App.jsx, not directly here, if it's part of the main layout */}
            {/* For now, assuming standalone component or main layout handles sidebar */}
            <div className="flex-grow p-4 sm:p-8 lg:p-12 flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-3xl p-8 sm:p-10 lg:p-12 max-w-2xl w-full text-center border border-gray-100 transform transition-transform duration-300 ease-in-out hover:scale-[1.01]">
                    <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight">
                        Your Profile
                    </h1>
                    <p className="text-lg text-gray-600 mb-10">Manage your account information.</p>

                    <div className="grid grid-cols-1 gap-6 mb-12">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Full Name:</p>
                            <p className="text-xl font-medium text-gray-800 break-words">{userProfile.fullName}</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Email Address:</p>
                            <p className="text-xl font-medium text-gray-800 break-words">{userProfile.email}</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Your Role:</p>
                            <p className="text-xl font-bold">
                                <span className={`px-4 py-1.5 rounded-full text-white text-lg shadow-md ${
                                    userProfile.role === 'ADMIN' ? 'bg-purple-700' :
                                        userProfile.role === 'TECHNICIAN' ? 'bg-blue-700' :
                                            userProfile.role === 'VIEWER' ? 'bg-green-700' :
                                                'bg-gray-700'
                                }`}>
                                    {userProfile.role}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleChangePasswordClick}
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold py-3.5 px-8 rounded-lg shadow-xl hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
