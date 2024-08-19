import Joi from 'joi';

// Joi validation schema for adding a new ambulance
export const addAmbulanceValidator = Joi.object({
    serviceprovider: Joi.string().required(),
    serviceprovidercontactnumber: Joi.string().required(),
    serviceprovideremail: Joi.string().email().required(),
    vehiclenumber: Joi.string().required(),
    drivername: Joi.string().required(),
    drivercontactnumber: Joi.string().required(),
    typeOfambulanceservice: Joi.string().valid('Government', 'Private',).required(),
    address: Joi.string().required(),
    status: Joi.string().valid('Available', 'On Call', 'Maintenance').default('Available'),
    image: Joi.string().allow(null, ''),
    assignedHospital: Joi.string().optional(),
    googleMapsLink: Joi.string().optional(),
    websiteLink: Joi.string().optional()
});

// Joi validation schema for updating an existing ambulance
export const updateAmbulanceValidator = Joi.object({
    serviceprovider: Joi.string(),
    serviceprovidercontactnumber: Joi.string(),
    vehiclenumber: Joi.string(),
    drivername: Joi.string(),
    drivercontactnumber: Joi.string(),
    typeOfambulanceservice: Joi.string().valid('Government', 'Private'),
    address: Joi.string(),
    status: Joi.string().valid('Available', 'On Call', 'Maintenance'),
    image: Joi.string().allow(null, ''),
    assignedHospital: Joi.string().optional(),
    googleMapsLink: Joi.string().optional(),
    websiteLink: Joi.string().optional()

});
