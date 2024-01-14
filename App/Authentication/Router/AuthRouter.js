import express from "express";
import dotenv from "dotenv";
import {
    deleteUser,
    login,
    profile,
    register,
} from "../Controller/AuthController.js";

dotenv.config();

export const AuthRouter = express.Router();

AuthRouter.post(process.env.AUTH_REGISTER_ENDPOINT, register);
AuthRouter.post(process.env.AUTH_LOGIN_ENDPOINT, login);
AuthRouter.get(process.env.AUTH_DELETE_ENDPOINT, deleteUser);
AuthRouter.get(process.env.AUTH_PROFILE_ENDPOINT, profile);
