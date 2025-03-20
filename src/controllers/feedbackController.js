import axios from "axios";
import CONFIG from "../config";

export const submitFeedback = async (stars, feedback) => {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.log('No token found in sessionStorage. Please log in.');
            return;
        }

        const response = await axios.post(`${CONFIG.API_BASE_URL}/feedback`, {
            stars: stars,
            feedback: feedback,
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
}
