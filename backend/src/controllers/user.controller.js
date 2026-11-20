const User = require("../models/user.model.js")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
}

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({
            message: "User with this email id already exists."
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hash,
        role: role || "member"
    });

    const token = jwt.sign(
        { id: user._id, role: user.role  },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
        message: "User registered successfully.",
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
            id: user._id
        }
    })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ 
            message: "Email and password are required."
        })
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch){
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
        message: "user logged in successfully.",
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
            id: user._id
        }
    })
}

const logoutUser = (req, res) => {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
        message: "User logged out successfully."
    })
}

const loggedInUser = async (req, res) => {
    if(!req.user) return;

    const user = await User.findById(req.user.id).select("-password -__v -createdAt -updatedAt");

    return res.status(200).json({
        message: "User is logged in.",
        user
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    loggedInUser
}