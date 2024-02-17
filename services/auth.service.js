import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Token } from '../models/token.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import colors from "@colors/colors"


const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        user = await User.create(req.body);

        return res
        .status(201)
        .json(
            { 
                success: true,
                 user: user
            }
        );

    }
     catch (error) 
    {
        res.status(500).json({ success: false, error: error.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne ({ email });

        console.log("user".brightYellow, user);

        if (!user) {
            console.log("No user with that email".brightMagenta);
            return res.status(404).json({ success: false, message: "No user with that email" });
        }

        let token = await Token.findOne({ userId: user._id });
        if (token) await token.deleteOne();

        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));

        console.log("hash".brightGreen, hash);

        await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save();

        console.log("resetToken".brightGreen, resetToken);

    const link = `http://localhost:3000/passwordReset?token=${resetToken}&id=${user._id}`;
    console.log("link".brightCyan.underline, link);
    sendEmail(
        user.email,
        "Password Reset Request",
        { 
            name: user.username,
            link: link 
        },
           "./template/requestResetPassword.handlebars"
        );

    res
    .status(200)
    .json(
        { 
            success: true, 
            message: "Password reset link sent to email" 
        }
    );

    return link;

    } catch (error) {
        console.log("error".brightRed, error);
        res.status(500).json({ success: false, error: error.message });
    }

    
}

const resetPassword = async (userId, token, password) => {
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
        throw new Error("Invalid or expired reset token");
    }

    console.log("passwordResetToken".brightYellow, passwordResetToken);

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    console.log("isValid".brightYellow, isValid);

    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    await User.findOneAndUpdate(
        {
             _id: userId 
        }, 
        { 
            password: hash 
        },
        {
            new: true,
        }
    );
    await passwordResetToken.deleteOne();

    res.status(201).json({ success: true, message: "Password reset success" });

    return true;
}


export { signup, login, resetPasswordRequest, resetPassword };