import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';
// Removed: import Sidebar from '../components/Sidebar'; // No longer needed here

const Dashboard = () => {
    const { user, authReady } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [printerStats, setPrinterStats] = useState({ // Fake printer data
        totalPrinters: 15,
        onlinePrinters: 12,
        offlinePrinters: 3,
        printersLowInk: 5,
        printersPaperJam: 1,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("DASHBOARD: Component Mounted/Re-rendered. User exists:", !!user, "authReady:", authReady);

        const fetchUserProfile = async () => {
            if (!authReady || !user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
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
    }, [user, authReady]);

    // Simplified checks for loading/error/no user
    if (loading || !authReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="text-center text-xl font-semibold text-gray-700 p-10 bg-white rounded-2xl shadow-xl animate-pulse">
                    <div className="flex items-center justify-center space-x-3">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading your dashboard...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !user || !userProfile) { // Consolidated error and unauthorized state
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-5 rounded-2xl shadow-xl text-center max-w-sm w-full" role="alert">
                    <strong className="font-bold text-xl block mb-2">Error!</strong>
                    <span className="block text-lg sm:inline ml-2">{error || 'Authentication Required! Please log in.'}</span>
                    <button
                        onClick={() => navigate('/')} // Navigate to login on any dashboard error
                        className="mt-6 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        // Removed the outer flex container, as AuthenticatedLayout now provides this.
        // Also removed <Sidebar /> from here as it's provided by AuthenticatedLayout.
        <div className="p-4 sm:p-8 lg:p-12 w-full"> {/* This div now serves as the main content area */}
            <div className="bg-white rounded-3xl shadow-3xl p-8 sm:p-10 lg:p-12 w-full text-center border border-gray-100 transform transition-transform duration-300 ease-in-out">
                <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight">
                    Welcome, <span className="text-indigo-700 drop-shadow-md">{userProfile.fullName}!</span>
                </h1>
                <p className="text-lg text-gray-600 mb-10">Overview of your printer network.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border border-indigo-200 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-indigo-800 mb-2">Total Printers</h3>
                        <p className="text-4xl font-extrabold text-indigo-600">{printerStats.totalPrinters}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-green-800 mb-2">Online Printers</h3>
                        <p className="text-4xl font-extrabold text-green-600">{printerStats.onlinePrinters}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl shadow-lg border border-red-200 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-red-800 mb-2">Offline Printers</h3>
                        <p className="text-4xl font-extrabold text-red-600">{printerStats.offlinePrinters}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-yellow-800 mb-2">Printers Low on Ink</h3>
                        <p className="text-4xl font-extrabold text-yellow-600">{printerStats.printersLowInk}</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl shadow-lg border border-pink-200 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-pink-800 mb-2">Printers with Paper Jam</h3>
                        <p className="text-4xl font-extrabold text-pink-600">{printerStats.printersPaperJam}</p>
                    </div>
                </div>
                {/* Logout, Manage Users, Change Password buttons are now ONLY in Sidebar */}
            </div>
        </div>
    );
};

export default Dashboard;
