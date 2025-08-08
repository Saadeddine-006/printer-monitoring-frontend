import React, { useState } from 'react';
import { createUser } from '../services/api';

const AddUserModal = ({ onClose, onUserAdded }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER'); // Default role
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false); // Reset success state on new submission

        try {
            const newUserData = {
                fullName,
                email,
                password,
                role
            };
            await createUser(newUserData);
            setSuccess(true); // Set success to true
            console.log("User created successfully!");

            if (onUserAdded) {
                onUserAdded(); // Callback to refresh parent list
            }

            // Automatically close modal after a short delay on success
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Error creating user:", err);
            setError(err.message || 'Failed to create user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative transform scale-95 animate-scale-in">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New User</h2>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl leading-none focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                    aria-label="Close modal"
                >
                    &times;
                </button>

                {/* Error message display */}
                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4 border border-red-200">
                        {error}
                    </p>
                )}
                {/* Success message display */}
                {success && (
                    <p className="bg-green-100 text-green-700 p-3 rounded-lg text-center mb-4 border border-green-200 animate-fade-in">
                        User created successfully!
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 transition duration-200"
                            required
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="TECHNICIAN">TECHNICIAN</option>
                            <option value="VIEWER">VIEWER</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-gray-300 text-gray-800 rounded-lg shadow-sm hover:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
