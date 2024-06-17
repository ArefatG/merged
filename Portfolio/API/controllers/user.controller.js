import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import createError from "../utils/createError.js";

export const deleteUser = async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
        return next(createError(403, "You can delete only your account!"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted.");
};
export const getUser = async(req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).send(user);
};
export const updateUser = async(req, res, next) => {
    try {
        const { password, ...others } = req.body;
        if (password) {
            others.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: others }, { new: true });
        // Remove the password from the response
        updatedUser.password = undefined;
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};