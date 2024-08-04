import { Schema, model } from "mongoose";
import {toJSON} from "@reis/mongoose-to-json"


const adminSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Attendee', 'Speaker'], default: 'Admin' }
}, {
}, {
    timestamps: true
});


adminSchema.plugin(toJSON);

export const AdminModel = model ('Admin', adminSchema);