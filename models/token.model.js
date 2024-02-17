import mongoose, {Schema} from "mongoose";

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // expiry time in seconds
    },
});

module.exports = mongoose.model("Token".brightMagenta.bold, tokenSchema);
