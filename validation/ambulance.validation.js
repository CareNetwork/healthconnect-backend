import Joi from 'joi';

// Joi validation schema for adding a new ambulance
export const addAmbulanceValidator = Joi.object({
    serviceprovider: Joi.string().required(),
    serviceprovidercontactnumber: Joi.string().required(),
    vehiclenumber: Joi.string().required(),
    drivername: Joi.string().required(),
    drivercontactnumber: Joi.string().required(),
    address: Joi.string().required(),
    status: Joi.string().valid('Available', 'On Call', 'Maintenance').default('Available'),
    assignedHospital: Joi.string().optional() 
});

// Joi validation schema for updating an existing ambulance
export const updateAmbulanceValidator = Joi.object({
    serviceprovider: Joi.string(),
    serviceprovidercontactnumber: Joi.string(),
    vehiclenumber: Joi.string(),
    drivername: Joi.string(),
    drivercontactnumber: Joi.string(),
    address: Joi.string(),
    status: Joi.string().valid('Available', 'On Call', 'Maintenance'),
    assignedHospital: Joi.string().optional() 
});