import express from "express";
import { register, login, logout, getUser, googleAuth, googleAuthCallback, handleUserFromGearStream } from '../controllers/auth.controller.js';
import { verifyToken } from "../middleware/jwt.js";
import passport from '../middleware/Passport.js';
import crypto from "crypto";
import sendEmail from "../utils/email.js";
import createError from "../utils/createError.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", verifyToken, getUser);

router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3001/login' }), googleAuthCallback);

// Add the new route for handling user info from GearStream
router.post("/handleUserFromGearStream", handleUserFromGearStream);

router.post("/forgot-password", async(req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(createError(404, "User not found!"));

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `http://localhost:3001/reset-password/${token}`;
        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${resetUrl}`;

        await sendEmail(user.email, "Password Reset Request", message);

        res.status(200).send("Password reset link sent to your email.");
    } catch (err) {
        next(err);
    }
});

// Reset Password Endpoint
router.post("/reset-password/:token", async(req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return next(createError(400, "Password reset token is invalid or has expired."));

        const hash = bcrypt.hashSync(password, 5);
        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).send("Password has been reset.");
    } catch (err) {
        next(err);
    }
});

export default router;
