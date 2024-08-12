import { Schema, model } from "mongoose";
import {toJSON} from "@reis/mongoose-to-json"


// Ambulance Service Schema
const hospitalSchema = new Schema({
    hospitalname: { type: String, required: true },
    phonenumber: { type: String, required: true },
    location: { type: String, required: true },
    servises: { type: String, enum: ['specialists', 'cardiology', 'outpatient', 'inpatient', 'cathetization', 'alied health services', 'theatre', 'radiology', 'laboratory', 'gastroscopy' ], default: 'inpatient' },
    bedsAvailable: { type: Number, required: true },
    totaldoctors: { type: Number, required: true }, 
    totalnurses: { type: Number, required: true },   
    totalemergencyUnits: { type: Number, required: true },
    image: { type: String, default: 'https://savefiles.org/secure/uploads/15585?shareable_link=252' },
    morgue: { type: Boolean, required: true },
    
}, {
    timestamps: true
});

hospitalSchema.plugin(toJSON);

export const HospitalModel = model('Hospital', hospitalSchema);