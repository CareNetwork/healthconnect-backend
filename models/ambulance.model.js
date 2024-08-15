import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";


// Ambulance Service Schema
const ambulanceServiceSchema = new Schema({
    serviceprovider: { type: String, required: true },
    serviceprovidercontactnumber: { type: String, required: true },
    vehiclenumber: { type: String, required: true, unique: true },
    drivername: { type: String, required: true },
    drivercontactnumber: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Available', 'On Call', 'Maintenance'], default: 'Available' },
    assignedHospital: { type: Types.ObjectId, ref: 'Hospital' },
    image: { type: String, default: 'https://savefiles.org/secure/uploads/15585?shareable_link=252' },
    websiteLink: { type: String },
    googleMapsLink: { type: String }
    
}, {
    timestamps: true
});

ambulanceServiceSchema.plugin(toJSON);

export const AmbulanceServiceModel = model('AmbulanceService', ambulanceServiceSchema);