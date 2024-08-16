import Joi from 'joi';

// Joi validation schema for adding a new hospital
export const addHospitalValidator = Joi.object({
    hospitalname: Joi.string().required(),
    phonenumber: Joi.string().required(),
    hospitalemail: Joi.string().email().required(),
    location: Joi.string().required(),
    typeOfhospital: Joi.string().valid('Government', 'Private').required(),
    services: Joi.array().items(Joi.string().valid(
        'specialists', 'Radiology', 'Gynaecology', 'Pediatrics', 'Electrocardiography',
        'Dietetics', 'Physiotherapy', 'Ear, Nose and Throat', 'Renal Dialysis',
        'Opthalmology', 'Neurosurgery', 'cardiology', 'outpatient', 'inpatient',
        'Spine Health', 'cathetization', 'alied health services', 'theatre',
        'radiology', 'laboratory', 'gastroscopy'
    )).default(['inpatient']),
    bedsAvailable: Joi.number().required(),
    totaldoctors: Joi.number().required(),
    totalnurses: Joi.number().required(),
    totalemergencyUnits: Joi.number().required(),
    morgue: Joi.boolean().required(),
    websiteLink: Joi.string().optional(),
    googleMapsLink: Joi.string().optional()
});

// Joi validation schema for updating an existing hospital
export const updateHospitalValidator = Joi.object({
    hospitalname: Joi.string(),
    phonenumber: Joi.string(),
    location: Joi.string(),
    typeOfhospital: Joi.string(),
    servises: Joi.string().valid(
        'specialists',
        'cardiology',
        'outpatient',
        'inpatient',
        'cathetization',
        'alied health services',
        'theatre',
        'radiology',
        'laboratory',
        'gastroscopy'
    ),
    bedsAvailable: Joi.number(),
    totaldoctors: Joi.number(),
    totalnurses: Joi.number(),
    totalemergencyUnits: Joi.number(),
    morgue: Joi.boolean()
});
