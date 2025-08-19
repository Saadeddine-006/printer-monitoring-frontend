import apiClient from './apiClient';

/**
 * Authenticates a user with credentials.
 * @param {Object} credentials - User's email and password.
 * @returns {Promise<Object>} AuthResponse containing token and user data.
 */
export async function login(credentials) {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
}

/**
 * Registers a new user (admin-driven creation with auto-generated password).
 * @param {Object} userData - User's full name, email, and role.
 * @returns {Promise<Object>} AuthResponse with user creation confirmation.
 */
export async function registerUser(userData) {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'User registration failed');
    }
}

/**
 * Fetches a paginated list of all users.
 * @returns {Promise<Object>} Response containing user list.
 */
export async function getUsers() {
    try {
        const response = await apiClient.get('/users');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
}

/**
 * Updates an existing user's details.
 * @param {number} id - The ID of the user to update.
 * @param {Object} userData - The new data for the user (fullName, email, role).
 * @returns {Promise<Object>} The response data from the API.
 */
export async function updateUser(id, userData) {
    try {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || `Failed to update user with ID: ${id}`);
    }
}

/**
 * Deletes a user by their ID.
 * @param {number} id - The ID of the user to delete.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function deleteUser(id) {
    try {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data; // Usually empty or success message
    } catch (error) {
        throw new Error(error.response?.data?.message || `Failed to delete user with ID: ${id}`);
    }
}

/**
 * Initiates a password reset process by sending an email.
 * @param {string} email - The email address for password reset.
 * @returns {Promise<string>} Success message from the API.
 */
export async function forgotPassword(email) {
    try {
        const response = await apiClient.post('/auth/forgot-password', email, {
            headers: {
                'Content-Type': 'text/plain' // Crucial for String @RequestBody on backend
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send reset link');
    }
}

/**
 * Changes a user's password.
 * @param {number} id - The ID of the user whose password is being changed.
 * @param {Object} passwordData - Object containing currentPassword and newPassword.
 * @returns {Promise<Object>} Response data from the API.
 */
export async function changePassword(id, passwordData) {
    try {
        const response = await apiClient.put(`/users/${id}/password`, passwordData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
    }
}
