import {Schema, model} from "mongoose";
import {toJSON} from "@reis/mongoose-to-json"

const blacklistedTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h' // Automatically delete after 24 hours
    }
});


blacklistedTokenSchema.plugin(toJSON);
export const BlacklistedTokenModel = model('BlacklistedToken', blacklistedTokenSchema);