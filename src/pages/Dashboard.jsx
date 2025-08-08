import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, authReady, logout } = useAuth();

    useEffect(() => {
        console.log("DASHBOARD: Component Mounted/Re-rendered. User exists:", !!user, "authReady:", authReady);
    });

    if (!authReady) {
        console.log("DASHBOARD: Auth not ready, showing loading...");
        return <p>Loading dashboard...</p>; // Or a spinner
    }

    if (!user) {
        console.log("DASHBOARD: Auth ready but no user, navigating back to login from Dashboard itself (should ideally be caught by PrivateRoute).");
        return <Navigate to="/" replace />;
    }

    console.log("DASHBOARD: Rendering content for user:", user.fullName, "with role:", user.role);

    return (
        <div className="p-8 max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
                Welcome, {user.fullName}!
            </h1>
            <p className="mb-6 text-lg text-gray-700">
                Your role: <span className="font-semibold text-indigo-700">{user.role}</span>
            </p>

            {/* Admin user management section */}
            {user.role === 'ADMIN' && (
                <div className="bg-indigo-50 p-6 rounded-md shadow-inner mb-6 border border-indigo-200">
                    <h2 className="text-2xl font-semibold mb-3 text-indigo-800">User Management</h2>
                    <p className="mb-4 text-indigo-700">As an administrator, you can manage users, roles, and permissions from here.</p>
                    <Link
                        to="/users"
                        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out text-lg font-medium"
                    >
                        Go to Users Page
                    </Link>
                </div>
            )}

            {/* Non-admin message */}
            {user.role !== 'ADMIN' && (
                <p className="text-gray-600 text-lg italic">
                    You do not have administrative access to user management features.
                </p>
            )}

            <div className="mt-8 text-center">
                <button
                    onClick={logout}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out text-lg font-medium"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
