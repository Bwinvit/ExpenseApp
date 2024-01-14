import mongoose from "mongoose";

const User = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model("User", User, "User");

export default UserModel;