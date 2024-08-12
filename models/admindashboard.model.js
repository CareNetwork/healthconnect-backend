import { Schema, model, Types } from 'mongoose';
import { toJSON } from '@reis/mongoose-to-json';

// Define AdminDashboard Schema
const adminDashboardSchema = new Schema({
    adminAccount: { type: Types.ObjectId, ref: 'AdminAccount' },
    hospitals: [{ type: Types.ObjectId, ref: 'Hospital' }],
    ambulanceService: [{ type: Types.ObjectId, ref: 'Ambulance' }],
    recentActivities: [{ type: Types.ObjectId, ref: 'ActivityLog' }],
    statistics: { type: Types.ObjectId, ref: 'UserVisit' }
}, {
    timestamps: true
});

// Add the toJSON plugin for better serialization
adminDashboardSchema.plugin(toJSON);

// Export the AdminDashboard model
export const AdminDashboard = model('AdminDashboard', adminDashboardSchema);
