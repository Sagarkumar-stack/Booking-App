import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

// 🔓 Handle expired tokens / 401 errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/"; // Force redirect to home/login
        }
        return Promise.reject(error);
    }
);

export default API;