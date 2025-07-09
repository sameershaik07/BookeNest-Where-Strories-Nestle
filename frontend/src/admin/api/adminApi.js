// src/api/adminApi.js

// Function to get the JWT token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Fetches a list of all users from the backend (admin-only endpoint).
 * Requires a valid JWT token in the Authorization header.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 * @throws {Error} If the fetch fails or the response is not OK.
 */
export const fetchUsers = async () => {
  const token = getToken();
  if (!token) {
    // Throw an error if no token is found, which UserList.js can catch and display.
    throw new Error('No authentication token found. Please log in as an admin.');
  }

  try {
    // This endpoint should match the one defined in your backend's authRoutes.js
    // (e.g., router.get('/api/admin/users', ...))
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send the JWT token for authentication
      },
    });

    if (!response.ok) {
      // Parse error response from the backend
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users.');
    }

    // Parse the successful response as JSON
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Re-throw the error so the calling component (UserList.js) can handle it
    throw error;
  }
};

/**
 * Fetches a single user by ID from the backend.
 * This function is a placeholder and would need a corresponding backend endpoint.
 * @param {string} id - The ID of the user to fetch.
 * @returns {Promise<Object>} A promise that resolves to a user object.
 * @throws {Error} If the fetch fails or the user is not found.
 */
export const fetchUserById = async (id) => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in as an admin.');
  }

  try {
    // Assuming a backend endpoint like /api/admin/users/:id
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/api/admin/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch user with ID: ${id}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error(`Error fetching user by ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates an existing user on the backend.
 * This function is a placeholder and would need a corresponding backend endpoint.
 * @param {string} id - The ID of the user to update.
 * @param {Object} data - The data to update the user with.
 * @returns {Promise<Object>} A promise that resolves to the updated user object.
 * @throws {Error} If the update fails.
 */
export const updateUser = async (id, data) => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in as an admin.');
  }

  try {
    // Assuming a backend endpoint like /api/admin/users/:id
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/api/admin/users/${id}`, {
      method: 'PUT', // Or PATCH depending on your backend
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update user with ID: ${id}`);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// You can add other admin-related API calls here (e.g., deleteUser)
