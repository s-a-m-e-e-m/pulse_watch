import axios from "axios";

const api = axios.create({
    baseURL: "https://pulse-watch-r7fh.onrender.com/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;