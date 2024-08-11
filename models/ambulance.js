import { Schema, model } from "mongoose";
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
    assignedHospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    
}, {
    timestamps: true
});

ambulanceServiceSchema.plugin(toJSON);

export const AmbulanceServiceModel = model('AmbulanceService', ambulanceServiceSchema);