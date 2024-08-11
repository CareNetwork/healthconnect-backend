import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const userVisitSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    visitDate: { type: Date, required: true },
    pageVisited: { type: String, required: true },
    duration: { type: Number, required: true }  // Duration in seconds
}, {
    timestamps: true
});

userVisitSchema.plugin(toJSON);

export const UserVisitModel = model('UserVisit', userVisitSchema);

