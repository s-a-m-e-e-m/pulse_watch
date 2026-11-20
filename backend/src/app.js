const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true 
}))

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const userRoutes = require("./routes/user.routes.js");
const endpointRoutes = require("./routes/endpoint.route.js");
const incidentRoutes = require("./routes/incident.route.js");
const alertRoutes = require("./routes/alert.route.js");
const healthlogRoutes = require("./routes/healthlog.router.js");

app.use("/api/users", userRoutes);
app.use("/api/endpoints", endpointRoutes);
app.use("/api/healthlogs", healthlogRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/alerts", alertRoutes);

module.exports = app;