import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const activityLogSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    adminAction: { type: Boolean, default: false },
    activity: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true
});

activityLogSchema.plugin(toJSON);

export const ActivityLogModel = model('ActivityLog', activityLogSchema);

