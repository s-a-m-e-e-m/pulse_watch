require("dotenv").config();

const app = require('./src/app');
const http = require('http');
const connectDB = require('./src/services/db.js');
const scheduleExistingEndpoints = require("./src/services/scheduleExistingEndpoints.js");

const { initSocket } = require("./src/sockets/socket.js")

require("./src/workers/endpoint.worker.js");

connectDB();

const server = http.createServer(app);

initSocket(server);

scheduleExistingEndpoints();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});