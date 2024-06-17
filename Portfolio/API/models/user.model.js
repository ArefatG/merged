import mongoose from "mongoose";
const { Schema } = mongoose;



const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        unique: true,
    },
    secret: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    img: {
        type: String,
        required: false,
    },
    City: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    desc: {
        type: String,
        required: false,
    },
    isSeller: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default mongoose.model("User", userSchema)