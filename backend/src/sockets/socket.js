const { Server } = require("socket.io");

let io;

function initSocket(server){
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket)=> {
        console.log("Connected :", socket.id);

        socket.on("disconnect", ()=> {
            console.log("Disconnected :", socket.id);
        });
    });
}

function getIO(){
    if(!io){
        throw new Error("Socket.io not initialized");
    }

    return io;
}

module.exports = {
    initSocket,
    getIO
}