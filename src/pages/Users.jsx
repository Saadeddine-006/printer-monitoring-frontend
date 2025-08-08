import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient'; // Your configured API client
import { useAuth } from '../contexts/AuthContext'; // To get the current user's role
import { deleteUser } from '../services/api'; // Import the deleteUser API call
import EditUserModal from '../components/EditUserModal'; // Corrected import path for EditUserModal
import AddUserModal from '../components/AddUserModal';   // Import the new AddUserModal component

const Users = () => {
    const { user: currentUser } = useAuth(); // Get the current logged-in user to check role
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false); // New state for Add User Modal visibility

    /**
     * Fetches the list of users from the API.
     * Handles loading, errors, and updates the users state.
     */
    const fetchUsers = async () => {
        try {
            setLoading(true); // Set loading true when starting fetch
            setError(null); // Clear previous errors
            const res = await apiClient.get('/users');
            // FIX: Access the 'content' array from the response data, as your backend wraps it.
            setUsers(res.data.content);
            // CRITICAL DEBUGGING STEP: Log the actual content of the users array for the email issue
            console.log("USERS_PAGE_DEBUG: Users fetched successfully (content):", res.data.content);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError('Failed to load users. Please ensure you have the necessary permissions.');
        } finally {
            setLoading(false);
        }
    };

    // Effect hook to fetch users when the component mounts or currentUser changes.
    useEffect(() => {
        // Only fetch users if the current user is an ADMIN, otherwise show access denied.
        if (currentUser && currentUser.role === 'ADMIN') {
            fetchUsers();
        } else {
            setError('You do not have permission to view this page.');
            setLoading(false); // Stop loading as we've determined access denied
        }
    }, [currentUser]); // Re-run this effect if the current user's details change.

    // --- Delete User Functions ---
    /**
     * Handles the click event for the delete button, setting the user to delete and showing the confirmation modal.
     * @param {Object} user - The user object to be deleted.
     */
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    /**
     * Confirms and executes the user deletion API call.
     * Refreshes the user list upon successful deletion.
     */
    const confirmDelete = async () => {
        if (!userToDelete) return; // Guard against accidental calls

        try {
            await deleteUser(userToDelete.id); // Call the API to delete the user
            console.log(`User ${userToDelete.email} deleted successfully.`);
            fetchUsers(); // Refresh the list to reflect the deletion
        } catch (err) {
            console.error("Error deleting user:", err);
            setError(`Failed to delete user: ${userToDelete.fullName}. ${err.message || ''}`);
        } finally {
            setShowDeleteConfirm(false); // Close the confirmation dialog
            setUserToDelete(null); // Clear the user to delete from state
        }
    };

    /**
     * Cancels the delete operation and closes the confirmation modal.
     */
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setUserToDelete(null);
    };

    // --- Edit User Functions ---
    /**
     * Handles the click event for the edit button, setting the user to edit and showing the edit modal.
     * @param {Object} user - The user object to be edited.
     */
    const handleEditClick = (user) => {
        setUserToEdit(user);
        setShowEditModal(true);
    };

    /**
     * Closes the edit user modal and refreshes the user list.
     */
    const closeEditModal = () => {
        setShowEditModal(false);
        setUserToEdit(null); // Clear the user being edited
        fetchUsers(); // Refresh the list, as changes might have occurred
    };

    // --- Add User Functions ---
    /**
     * Handles the click event for the "Add New User" button, showing the add user modal.
     */
    const handleAddUserClick = () => {
        setShowAddUserModal(true);
    };

    /**
     * Closes the add user modal and refreshes the user list (since a new user might have been added).
     */
    const closeAddUserModal = () => {
        setShowAddUserModal(false);
        fetchUsers(); // Refresh the list to show the newly added user
    };


    // --- Conditional Rendering for Loading and Errors ---
    if (loading) return <p className="text-center p-8 text-lg">Loading users...</p>;
    if (error) return <p className="text-red-600 text-center p-8 text-lg">{error}</p>;

    // --- Access Control for Non-Admins ---
    // If current user is not an ADMIN, display an access denied message.
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return (
            <div className="p-8 max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-10 text-center">
                <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Access Denied</h1>
                <p className="text-red-600 text-lg">You do not have administrative permissions to view this page.</p>
            </div>
        );
    }

    // --- Main Component Render for Admins ---
    return (
        <div className="p-8 max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Users Overview</h1>

            {/* Add User Button - displayed for admins */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleAddUserClick}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-lg font-medium shadow-md"
                >
                    Add New User
                </button>
            </div>

            {/* Conditional rendering for user table or "No users found" message */}
            {users.length === 0 ? (
                <p className="text-gray-600 text-center text-lg">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">Name</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th> {/* New Header for Edit/Delete */}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{user.fullName}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{user.email}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            user.role === 'ADMIN' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 space-x-2"> {/* Actions Column */}
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded-lg transition duration-200"
                                    >
                                        Edit
                                    </button>
                                    {/* Disable delete button for the currently logged-in admin */}
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        className={`text-sm font-bold py-1 px-3 rounded-lg transition duration-200 ${
                                            currentUser.id === user.id
                                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' // Style for disabled
                                                : 'bg-red-500 hover:bg-red-600 text-white' // Style for enabled
                                        }`}
                                        disabled={currentUser.id === user.id} // Prevent admin from deleting themselves
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation Modal - Conditionally rendered based on state */}
            {showDeleteConfirm && userToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">
                            Are you sure you want to delete user "
                            <span className="font-semibold">{userToDelete.fullName}</span>" (
                            <span className="font-semibold">{userToDelete.email}</span>)?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal - Conditionally rendered based on state */}
            {showEditModal && userToEdit && (
                <EditUserModal user={userToEdit} onClose={closeEditModal} currentUser={currentUser} />
            )}

            {/* Add User Modal - Conditionally rendered based on state */}
            {showAddUserModal && (
                <AddUserModal onClose={closeAddUserModal} onUserAdded={fetchUsers} />
            )}
        </div>
    );
};

export default Users;
