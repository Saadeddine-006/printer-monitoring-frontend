import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { deleteUser } from '../services/api';
import EditUserModal from '../components/EditUserModal';
import AddUserModal from '../components/AddUserModal';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/users');
            setUsers(res.data.content);
            console.log("USERS_PAGE_DEBUG: Users fetched successfully (content):", res.data.content);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError('Failed to load users. Please ensure you have the necessary permissions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Allow both ADMIN and TECHNICIAN roles to fetch and view users
        if (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'TECHNICIAN')) {
            fetchUsers();
        } else {
            // New debug log here
            console.warn("USERS_PAGE_DEBUG: Access denied path triggered. currentUser:", currentUser);
            setError('You do not have permission to view this page.');
            setLoading(false);
        }
    }, [currentUser]);

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            console.log(`User ${userToDelete.email} deleted successfully.`);
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            setError(`Failed to delete user: ${userToDelete.fullName}. ${err.message || ''}`);
        } finally {
            setShowDeleteConfirm(false);
            setUserToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setUserToDelete(null);
    };

    const handleEditClick = (user) => {
        setUserToEdit(user);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setUserToEdit(null);
        fetchUsers();
    };

    const handleAddUserClick = () => {
        setShowAddUserModal(true);
    };

    const closeAddUserModal = () => {
        setShowAddUserModal(false);
        fetchUsers();
    };

    const handleGoBackToDashboard = () => {
        navigate('/dashboard');
    };

    if (loading) return <p className="text-center p-8 text-lg text-gray-700">Loading users...</p>;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
                <button
                    onClick={handleGoBackToDashboard}
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );

    // If user is not ADMIN or TECHNICIAN, deny access.
    if (!currentUser || !(currentUser.role === 'ADMIN' || currentUser.role === 'TECHNICIAN')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-xl shadow-lg" role="alert">
                    <strong className="font-bold">Access Denied!</strong>
                    <span className="block sm:inline ml-2">You do not have permission to view this page.</span>
                    <button
                        onClick={handleGoBackToDashboard}
                        className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-8 mt-8 lg:mt-12 border border-gray-100">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-gray-900 text-center">Users Overview</h1>

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={handleGoBackToDashboard}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                        Back to Dashboard
                    </button>
                    {/* Only show "Add New User" button if current user is ADMIN */}
                    {currentUser.role === 'ADMIN' && (
                        <button
                            onClick={handleAddUserClick}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-teal-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Add New User
                        </button>
                    )}
                </div>

                {users.length === 0 ? (
                    <p className="text-gray-600 text-center text-lg py-8">No users found. {currentUser.role === 'ADMIN' && 'Click "Add New User" to get started!'}</p>
                ) : (
                    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                        <table className="min-w-full bg-white divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">Name</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                {/* Only show "Actions" header if current user is ADMIN */}
                                {currentUser.role === 'ADMIN' && (
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
                                )}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-100 transition duration-150 ease-in-out">
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{user.fullName}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{user.email}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                user.role === 'ADMIN' ? 'bg-purple-200 text-purple-800' :
                                                    user.role === 'TECHNICIAN' ? 'bg-blue-200 text-blue-800' :
                                                        user.role === 'VIEWER' ? 'bg-green-200 text-green-800' :
                                                            'bg-gray-200 text-gray-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                    </td>
                                    {/* Only show action buttons if current user is ADMIN */}
                                    {currentUser.role === 'ADMIN' && (
                                        <td className="py-3 px-4 whitespace-nowrap text-sm space-x-2">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold py-1.5 px-3 rounded-md shadow-sm transition duration-200 transform hover:scale-105"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user)}
                                                className={`text-xs font-bold py-1.5 px-3 rounded-md shadow-sm transition duration-200 transform hover:scale-105 ${
                                                    currentUser.id === user.id
                                                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                                }`}
                                                disabled={currentUser.id === user.id}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && userToDelete && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full transform scale-95 animate-scale-in">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Confirm Deletion</h2>
                        <p className="mb-6 text-gray-700">
                            Are you sure you want to delete user "
                            <span className="font-semibold text-red-600">{userToDelete.fullName}</span>" (
                            <span className="font-semibold text-red-600">{userToDelete.email}</span>)?
                            <br/><br/>This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-5 py-2.5 bg-gray-300 text-gray-800 rounded-lg shadow-sm hover:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && userToEdit && (
                <EditUserModal user={userToEdit} onClose={closeEditModal} currentUser={currentUser} />
            )}

            {/* Add User Modal */}
            {showAddUserModal && (
                <AddUserModal onClose={closeAddUserModal} onUserAdded={fetchUsers} />
            )}
        </div>
    );
};

export default Users;
