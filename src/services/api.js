const API_BASE_URL = 'http://localhost:8080/api/user';  // Changed back to /api/user

const api = {
    auth: {
        login: async (credentials) => {
            try {
                console.log('Sending login request:', credentials);
                
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed');
                }

                const data = await response.json();
                console.log('Server response:', data);
                return data;
            } catch (error) {
                console.error('Login error:', error);
                throw new Error('Invalid email or password');
            }
        },
        register: async (userData) => {
            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: userData.username,
                        email: userData.email,
                        password: userData.password,
                        role: 'MEMBER',
                        profile: {
                            full_name: userData.full_name || userData.username,
                            phone_number: userData.phone_number || '',
                            avatar: userData.avatar || ''
                        }
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Registration failed');
                }
                
                return await response.json();
            } catch (error) {
                console.error('Register error:', error);
                throw error;
            }
        },
        changePassword: async (passwordData) => {
            try {
                const response = await fetch(`${API_BASE_URL}/change-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    mode: 'cors',
                    body: JSON.stringify(passwordData)
                });
                
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Password change failed');
                }
                return data;
            } catch (error) {
                throw error;
            }
        }
    },

    user: {
        getAllUsers: async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/all`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    mode: 'cors'
                });
                
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch users');
                }
                return data;
            } catch (error) {
                throw error;
            }
        },

        getUserById: async (id) => {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    mode: 'cors'
                });
                
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch user');
                }
                return data;
            } catch (error) {
                throw error;
            }
        }
    }
};

export default api;
