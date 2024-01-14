import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../../../Database/Model/UserModel.js";

dotenv.config();

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "Email is already registered",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        await user.save();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.query;
        if (!req.headers.authorization) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header missing",
            });
        }

        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (decodedToken.userId !== id) {
            return res.status(403).json({
                status: "error",
                message: "You are not authorized to delete this user",
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            status: "success",
            message: "User deleted successfully",
        });
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                status: "error",
                message: "Invalid token",
            });
        }
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

const profile = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header missing",
            });
        }

        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        res.status(200).json({
            status: "success",
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                status: "error",
                message: "Invalid token",
            });
        }
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export { register, login, deleteUser, profile };
