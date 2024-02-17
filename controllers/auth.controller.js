import {
    signup,
    resetPasswordRequest,
    resetPassword,
} from "../services/auth.service.js";

import colors from "@colors/colors"

const signupController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await signup(username, email, password);
        console.log("user".bgMagenta, user);
        res.status(201).json({ user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const resetPasswordRequestController = async (req, res, next) => {
    const requestResetPassword = await resetPasswordRequest(req.body.email);

    if (requestResetPassword) {
        console.log("requestResetPassword".bgCyan, requestResetPassword);
        res.status(200).json(requestResetPassword);
    } else {
        console.log("Error".bgCyan);
        res.status(500).json({ message: "Email could not be sent" });
    }
}

const resetPasswordController = async (req, res, next) => {
    const resetPasswordResponse = await resetPassword(req.body);
    if (resetPasswordResponse) {
        console.log("resetPasswordResponse".bgCyan, resetPasswordResponse);
        res.status(200).json(resetPasswordResponse);
    } else {
        console.log("Error".bgRed);
        res.status(500).json({ message: "Error resetting password" });
    }
}

module.exports = {
    signupController,
    resetPasswordRequestController,
    resetPasswordController,
}


