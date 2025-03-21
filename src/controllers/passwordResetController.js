import axios from 'axios';
import CONFIG from "../config.js";
// TODO: Send api call to backend with email to create reset token
export const sendResetLink = async (email) => {
    try {
        await axios.post(`${CONFIG.API_BASE_URL}/reset-link`, {
            email: email
        });
    } catch (error) {
        console.error(error);
    }
}
