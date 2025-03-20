import axios from 'axios';
import CONFIG from "../config";



// TODO: Make post request to backend for login
export const authenticateUser = async (email, password) => {
    try {
        const response = await axios.post(`${CONFIG.API_BASE_URL}/login`, {
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        if (!error.response) {
            return {
                error: 'Network error or server is unreachable',
            };
        }

        if (error.response.status === 401) {
            return {
                error: error.response.data.error || 'Invalid email or password',
            };
        }

        return {
            error: error.response.data.error || 'An unexpected error occurred.',
        };
    }
};

// TODO: Make post request to backend for register
export const signupUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${CONFIG.API_BASE_URL}/signup`, {
            username: username,
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        if (!error.response) {
            return {
                error: 'Network error or server is unreachable',
            };
        }

        return {
            error: error.response.data.error || 'An unexpected error occurred.',
        }
    }
}