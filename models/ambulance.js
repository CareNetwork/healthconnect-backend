import { Schema, model } from "mongoose";
import {toJSON} from "@reis/mongoose-to-json"


// Ambulance Service Schema
const ambulanceServiceSchema = new Schema({
    serviceprovider: { type: String, required: true },
    contact_number: { type: String, required: true },
    address: { type: String, required: true },
    available: { type: Boolean, default: true },
    
}, {
    timestamps: true
});

ambulanceServiceSchema.plugin(toJSON);

export const AmbulanceServiceModel = model('AmbulanceService', ambulanceServiceSchema);