import apiClient from './apiClient';

export async function login(credentials) {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        // More specific error handling for login failures
        throw new Error(error.response?.data?.message || 'Login failed');
    }
}

/**
 * Deletes a user by their ID.
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<Object>} The response data from the API.
 */
export async function deleteUser(userId) {
    try {
        const response = await apiClient.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        // Provide a more informative error message
        throw new Error(error.response?.data?.message || `Failed to delete user with ID: ${userId}`);
    }
}

/**
 * Updates an existing user's details.
 * @param {number} userId - The ID of the user to update.
 * @param {Object} userData - The new data for the user (fullName, email, role).
 * @returns {Promise<Object>} The response data from the API.
 */
export async function updateUser(userId, userData) {
    try {
        const response = await apiClient.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        // Include backend error message if available
        throw new Error(error.response?.data?.message || `Failed to update user with ID: ${userId}`);
    }
}

/**
 * Creates a new user.
 * @param {Object} userData - The data for the new user (fullName, email, password, role).
 * @returns {Promise<Object>} The response data from the API.
 */
export async function createUser(userData) {
    try {
        // Assuming POST to /users endpoint for admin-driven user creation
        const response = await apiClient.post('/users', userData);
        return response.data;
    } catch (error) {
        // Provide common reasons for creation failure
        throw new Error(error.response?.data?.message || 'Failed to create user. Ensure email is unique and password is strong.');
    }
}
