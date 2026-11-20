const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, loggedInUser } = require("../controllers/user.controller.js")
const authMiddleware = require("../middleware/auth.middleware.js")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/logout", authMiddleware, logoutUser);
router.get("/loggedin", authMiddleware, loggedInUser);

module.exports = router;