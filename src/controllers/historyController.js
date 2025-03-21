// TODO: Grab user's macronutrient history
import axios from "axios";
import CONFIG from "../config.js";
export const getUserHistory = async () => {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.log('No token found in sessionStorage. Please log in.');
        }

        const response = await axios.get(`${CONFIG.API_BASE_URL}/history`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.history;

    } catch (error) {
        console.error('Error fetching user history:', error.message);
    }
}

export const addUserHistory = async (history_entry) => {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.log('No token found in sessionStorage. Please log in.');
            return;
        }

        const response = await axios.post(`${CONFIG.API_BASE_URL}/history`, {
            history_entry: history_entry,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error adding user history:', error.message);
    }
};

export const resetUserHistory = async () => {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.log('No token found in sessionStorage. Please log in.');
        }

        const response = await axios.get(`${CONFIG.API_BASE_URL}/wipe`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error fetching user history:', error.message);
    }
}
