import React, { useState, useEffect } from 'react';
import { updateUser } from '../services/api';

const EditUserModal = ({ user, onClose, currentUser }) => {
    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const isSelfEdit = currentUser && user.id === currentUser.id;

    useEffect(() => {
        setFullName(user.fullName);
        setEmail(user.email);
        setRole(user.role);
        setSuccess(false);
        setError(null);
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const updatedUserData = {
                fullName,
                email,
                role: isSelfEdit ? user.role : role
            };

            console.log("EDIT_MODAL: Sending update data for user ID", user.id, ":", updatedUserData);

            const response = await updateUser(user.id, updatedUserData);
            setSuccess(true);
            console.log("EDIT_MODAL: User updated successfully! API Response:", response);

            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error("EDIT_MODAL: Error updating user:", err);
            setError(err.message || 'Failed to update user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative transform scale-95 animate-scale-in">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit User: <span className="text-indigo-600">{user.fullName}</span></h2>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl leading-none focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
                    aria-label="Close modal"
                >
                    &times;
                </button>

                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4 border border-red-200">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="bg-green-100 text-green-700 p-3 rounded-lg text-center mb-4 border border-green-200">
                        User updated successfully!
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={isSelfEdit}
                            className={`w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 ${isSelfEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            required
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="TECHNICIAN">TECHNICIAN</option> {/* CORRECTED from TECHNICIEN */}
                            <option value="VIEWER">VIEWER</option>
                        </select>
                        {isSelfEdit && (
                            <p className="mt-1 text-sm text-gray-600">You cannot change your own role.</p>
                        )}
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
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
