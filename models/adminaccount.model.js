import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";


// create new Schema
const adminAccountSchema = new Schema({
    profilePicture: { type: String },
    bio: { type: String },
    maritalStatus: { type: String, enum: ['single', 'married', 'prefer-not-to-say'] },
    sex: { type: String },
    admin: { type: Types.ObjectId, ref: 'Admin' }
});

adminAccountSchema.plugin(toJSON);
export const adminAccount = model('Profile', adminAccountSchema);