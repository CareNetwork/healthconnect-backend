import { Schema, model } from "mongoose";
import {toJSON} from "@reis/mongoose-to-json"


// Ambulance Service Schema
const hospitalSchema = new Schema({
    hospitalname: { type: String, required: true },
    phonenumber: { type: String, required: true },
    hospitalemail: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    typeOfhospital: { type: String, enum: ['Government', 'Private'], required: true },
    services: { type: [String], enum: [
            'specialists', 'Radiology', 'Gynaecology', 'Pediatrics', 'Electrocardiography',
            'Dietetics', 'Physiotherapy', 'Ear, Nose and Throat', 'Renal Dialysis',
            'Opthalmology', 'Neurosurgery', 'cardiology', 'outpatient', 'inpatient',
            'Spine Health', 'cathetization', 'alied health services', 'theatre',
            'radiology', 'laboratory', 'gastroscopy'],
        default: ['inpatient']
    },
    bedsAvailable: { type: Number, required: true },
    totaldoctors: { type: Number, required: true }, 
    totalnurses: { type: Number, required: true },   
    totalemergencyUnits: { type: Number, required: true },
    image: { type: String },
    morgue: { type: Boolean, required: true },
    websiteLink: { type: String },
    googleMapsLink: { type: String },
    
}, {
    timestamps: true
});

hospitalSchema.plugin(toJSON);

export const HospitalModel = model('Hospital', hospitalSchema);