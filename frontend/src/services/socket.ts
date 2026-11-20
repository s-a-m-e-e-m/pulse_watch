import { io } from "socket.io-client";

export const socket = io(
    "https://pulse-watch-r7fh.onrender.com",
    {
        withCredentials: true
    }
);