import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient'; // Ensure apiClient is imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate for the Users button

const Dashboard = () => {
    const { user, authReady, logout } = useAuth(); // Get user and authReady from context
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        console.log("DASHBOARD: Component Mounted/Re-rendered. User exists:", !!user, "authReady:", authReady);

        const fetchUserProfile = async () => {
            if (!authReady || !user) {
                // If auth is not ready or user is not logged in, don't fetch profile yet
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                // Make API call to fetch user profile using the authenticated apiClient
                const response = await apiClient.get('/users/profile');
                setUserProfile(response.data);
                console.log("DASHBOARD: User Profile fetched successfully:", response.data);
            } catch (err) {
                console.error("DASHBOARD: Error fetching user profile:", err);
                setError('Failed to load user profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, authReady]); // Re-run when user or authReady state changes

    const handleLogout = () => {
        logout(); // Call the logout function from AuthContext
        navigate('/'); // Redirect to the root path (/) after logout
    };

    const handleManageUsers = () => {
        navigate('/users'); // Navigate to the Users page
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center text-lg text-gray-700 p-8 bg-white rounded-xl shadow-lg">
                    Loading your profile...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg text-center" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                    <button
                        onClick={handleLogout}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    // If user and userProfile are null, it means there was an auth issue not caught by specific error
    if (!user || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl shadow-lg text-center" role="alert">
                    <strong className="font-bold">Authentication Required!</strong>
                    <span className="block sm:inline ml-2">Please log in to view the dashboard.</span>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full text-center border border-gray-200 transform hover:scale-102 transition-transform duration-300 ease-in-out">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-gray-900 leading-tight">
                    Welcome, <span className="text-indigo-600">{userProfile.fullName}!</span>
                </h1>

                <div className="space-y-4 text-left mx-auto max-w-sm">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm font-semibold text-gray-600">Email:</p>
                        <p className="text-lg text-gray-800 break-words">{userProfile.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                        <p className="text-sm font-semibold text-gray-600">Role:</p>
                        <p className="text-lg font-bold">
                            <span className={`px-3 py-1 rounded-full text-white text-md ${
                                userProfile.role === 'ADMIN' ? 'bg-purple-600' :
                                    userProfile.role === 'TECHNICIAN' ? 'bg-blue-600' : // Technician role color
                                        userProfile.role === 'VIEWER' ? 'bg-green-600' :
                                            'bg-gray-600'
                            }`}>
                                {userProfile.role}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="mt-10 space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
                    {/* Show 'Manage Users' button for both ADMIN and TECHNICIAN roles */}
                    {(userProfile.role === 'ADMIN' || userProfile.role === 'TECHNICIAN') && (
                        <button
                            onClick={handleManageUsers}
                            className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Manage Users
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
