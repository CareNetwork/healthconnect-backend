import Joi from 'joi';

// Joi validation schema for adding a new hospital
export const addHospitalValidator = Joi.object({
    hospitalname: Joi.string().required(),
    phonenumber: Joi.string().required(),
    location: Joi.string().required(),
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
    ).default('inpatient'),
    bedsAvailable: Joi.number().required(),
    totaldoctors: Joi.number().required(),
    totalnurses: Joi.number().required(),
    totalemergencyUnits: Joi.number().required(),
    morgue: Joi.boolean().required()
});

// Joi validation schema for updating an existing hospital
export const updateHospitalValidator = Joi.object({
    hospitalname: Joi.string(),
    phonenumber: Joi.string(),
    location: Joi.string(),
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
