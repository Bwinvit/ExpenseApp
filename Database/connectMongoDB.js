import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../Core/AppLogger.js";

dotenv.config();

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info("MongoDB Connected");
    } catch (error) {
        logger.error(error);
    }
};

export default connectMongoDB;