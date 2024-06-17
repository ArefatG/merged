import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from 'passport';

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = (req, res) => {
    const token = jwt.sign({
            id: req.user._id,
            isSeller: req.user.isSeller,
        },
        process.env.JWT_KEY
    );

    const { password, ...info } = req.user._doc;
    res.cookie("accessToken", token, {
        httpOnly: true,
    });

    // Send the user info to the frontend
    res.redirect(`http://localhost:3001/login?user=${encodeURIComponent(JSON.stringify(info))}`);
};

export const register = async(req, res, next) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 5);
        const newUser = new User({
            ...req.body,
            password: hash,
        });

        await newUser.save();
        res.status(201).send("User has been created.");
    } catch (err) {
        if (err.code === 11000) { // MongoDB duplicate key error code
            const field = Object.keys(err.keyPattern)[0]; // Extract the duplicate field
            const errorMessage = field === 'email' ? 'This email is already registered.' : 'This username is already taken.';
            res.status(400).json({ message: errorMessage });
        } else {
            next(err);
        }
    }
};

export const login = async(req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "User not found!"));

        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isCorrect)
            return next(createError(400, "Wrong password or username!"));

        const token = jwt.sign({
                id: user._id,
                isSeller: user.isSeller,
            },
            process.env.JWT_KEY
        );

        const { password, ...info } = user._doc;
        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).send(info);
    } catch (err) {
        next(err);
    }
};

export const logout = async(req, res) => {
    res.clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
    }).status(200).send("User has been logged out.");
};

export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return next(createError(404, "User not found!"));
        const { password, ...info } = user._doc;
        res.status(200).send(info);
    } catch (err) {
        next(err);
    }
};

const generateUniqueUsername = async (baseUsername) => {
    let username = baseUsername;
    let suffix = 0;

    while (await User.findOne({ username })) {
        suffix += 1;
        username = `${baseUsername}_${suffix}`;
    }

    return username;
};

export const handleUserFromGearStream = async (req, res, next) => {
    try {
        const { email, displayName, photoURL } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            // Compare the username
            if (user.username === displayName) {
                // Update the existing user's image
                user.img = photoURL;
                await user.save();
            } else {
                // Update the existing user's image
                user.img = photoURL;
                await user.save();
            }
        } else {
            // Check if the username already exists
            let uniqueUsername = displayName;
            let usernameUser = await User.findOne({ username: displayName });
            if (usernameUser) {
                uniqueUsername = await generateUniqueUsername(displayName);
            }

            // Create new user
            user = new User({
                email,
                username: uniqueUsername,
                img: photoURL,
                password: bcrypt.hashSync('defaultPassword', 5) // You might want to handle passwords differently
            });
            await user.save();
        }

        const token = jwt.sign({
            id: user._id,
            isSeller: user.isSeller,
        }, process.env.JWT_KEY);

        const { password, ...info } = user._doc;
        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).send(info);
    } catch (err) {
        next(err);
    }
};
