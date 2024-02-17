import mongoose, { Schema } from "mongoose";
import colors from "@colors/colors";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const bcryptSalt = process.env.BCRYPT_SALT || 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        required: true,
    }
},
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    
    const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
    this.password = hash;
    next();
}
);

module.exports = mongoose.model("User", userSchema);
