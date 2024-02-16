import mongoose, {Schema} from "mongoose";
import colors from "@colors/colors";
import dotenv from "dotenv";
dotenv.config();

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // expiry time in seconds
    },
});

module.exports = mongoose.model("Token".brightMagenta.bold, tokenSchema);
