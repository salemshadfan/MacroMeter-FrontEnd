import axios from "axios";
import CONFIG from "../config.js";


const saveToken = (token) => {
    sessionStorage.setItem("token", token);
};

export const getToken = () => {
    return sessionStorage.getItem("token");
};


export const logoutUser = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login"; 
};


export const authenticateUser = async (email, password) => {
    try {
        const response = await axios.post(`${CONFIG.API_BASE_URL}/login`, {
            email,
            password,
        });

        if (response.data.token) {
            saveToken(response.data.token); 
        }

        return response.data;
    } catch (error) {
        return handleError(error, "Invalid email or password");
    }
};


export const signupUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${CONFIG.API_BASE_URL}/signup`, {
            username,
            email,
            password,
        });

        return response.data;
    } catch (error) {
        return handleError(error, "Registration failed");
    }
};


export const validateToken = async () => {
    const token = getToken();
    if (!token) return false;

    try {
        const response = await axios.get(`${CONFIG.API_BASE_URL}/api/auth-check`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.status === 200;
    } catch (error) {
        console.error("JWT validation failed:", error);
        logoutUser(); 
        return false;
    }
};


const handleError = (error, defaultMessage) => {
    if (!error.response) {
        return { error: "Network error or server is unreachable" };
    }

    return {
        error: error.response.data.error || defaultMessage,
    };
};
