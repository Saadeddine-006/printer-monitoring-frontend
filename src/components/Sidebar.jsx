import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col h-full shadow-lg rounded-tr-lg rounded-br-lg p-4">
            <div className="flex items-center justify-center p-4 border-b border-gray-700 mb-6">
                <h1 className="text-3xl font-extrabold text-indigo-400">MonitorPro</h1>
            </div>

            <nav className="flex-grow space-y-3">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg text-lg font-medium transition-colors duration-200 
                        ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                    }
                >
                    <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    Dashboard
                </NavLink>

                {/* Users link - visible to ADMIN and TECHNICIAN */}
                {(user && (user.role === 'ADMIN' || user.role === 'TECHNICIAN')) && (
                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg text-lg font-medium transition-colors duration-200 
                            ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                        }
                    >
                        <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.149-1.291-.432-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.149-1.291.432-1.857m0 0a2.001 2.001 0 011.825-1.11zm10.155 0A2.001 2.001 0 0115 18v-2a3 3 0 00-5.356-1.857m0 0a2.001 2.001 0 011.825-1.11zM11 12H9a2 2 0 00-2 2v2m11-6H9a2 2 0 00-2 2v2"></path></svg>
                        Users
                    </NavLink>
                )}

                {/* Profile link - visible to all authenticated users */}
                {user && (
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg text-lg font-medium transition-colors duration-200 
                            ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                        }
                    >
                        <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        Profile
                    </NavLink>
                )}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-700">
                {user && (
                    <div className="mb-4 text-center">
                        <p className="text-gray-400 text-sm">Logged in as:</p>
                        <p className="font-semibold text-lg">{user.fullName || user.email}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            user.role === 'ADMIN' ? 'bg-purple-600' :
                                user.role === 'TECHNICIAN' ? 'bg-blue-600' :
                                    user.role === 'VIEWER' ? 'bg-green-600' :
                                        'bg-gray-600'
                        }`}>
                            {user.role}
                        </span>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200 text-lg font-medium"
                >
                    <svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
