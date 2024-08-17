import { addHospitalValidator, updateHospitalValidator } from '../validation/hospital.validation.js';
import { HospitalModel } from '../models/hospital.model.js';



// export const addHospital = async (req, res, next) => {
//     try {
//       // Validate the request body
//       const { error, value } = addHospitalValidator.validate(req.body);
//       if (error) {
//         return res.status(400).send(error.details[0].message);
//       }

//       // Destructure validated value
//       const { hospitalname, hospitalemail } = value;

//       // Check if a hospital with the same email already exists
//       const existingHospital = await HospitalModel.findOne({ hospitalemail });
//       if (existingHospital) {
//         return res.status(409).send("Hospital with this email already exists");
//       }

//       // Create new hospital
//       const newHospital = new HospitalModel(value);
//       await newHospital.save();

//       // Respond with success
//       return res.status(201).json({ message: "Hospital added successfully", hospital: newHospital });
//     } catch (err) {
//       // Handle unexpected errors
//       console.error("Error adding hospital:", err); // Log error for debugging
//       return res.status(500).send("An error occurred while adding the hospital");
//     }
//   };
const BASE_URL = 'https://savefiles.org/drive/folders/MTE3ODV8cGFkZA/';

export const addHospital = async (req, res, next) => {
    try {

        const imagePath = req.file ? req.file.filename : undefined;
        const imageUrl = imagePath ? `${BASE_URL}${imagePath}` : undefined;

        const hospitalData = {
            ...req.body,
            image: imageUrl,
            bedsAvailable: Number(req.body.bedsAvailable),
            totaldoctors: Number(req.body.totaldoctors),
            totalnurses: Number(req.body.totalnurses),
            totalemergencyUnits: Number(req.body.totalemergencyUnits),
            morgue: req.body.morgue === 'true'
        };

        console.log('Hospital Data to be saved:', hospitalData);

        // Validate the combined data
        const { error, value } = addHospitalValidator.validate(hospitalData);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Destructure validated value
        const { hospitalname, hospitalemail } = value;

        // Check if a hospital with the same email already exists
        const existingHospital = await HospitalModel.findOne({ hospitalemail });
        if (existingHospital) {
            return res.status(409).send("Hospital with this email already exists");
        }

        // Create new hospital
        const newHospital = new HospitalModel(value);
        await newHospital.save();

        // Respond with success
        return res.status(201).json({ message: "Hospital added successfully", hospital: newHospital });
    } catch (err) {
        // Handle unexpected errors
        console.error("Error adding hospital:", err);
        return res.status(500).send("An error occurred while adding the hospital");
    }
};


// export const getAllHospitals = async (req, res, next) => {
//     try {
//         const { servises, location, morgue, populate } = req.query;
//         let filter = {};

//         if (servises) filter.servises = servises;
//         if (location) filter.location = { $regex: location, $options: 'i' };
//         if (morgue !== undefined) filter.morgue = morgue === 'true';

//         const defaultPopulate = [
//             { path: "totaldoctors", select: "name specialization" },
//             { path: "totalnurses", select: "name" },
//             { path: "ambulances", select: "vehiclenumber status" }
//         ];

//         let query = HospitalModel.find(filter);

//         if (populate) {
//             const populateOptions = JSON.parse(populate);
//             query = query.populate(populateOptions);
//         } else {
//             query = query.populate(defaultPopulate);
//         }

//         const hospitals = await query.exec();

//         // return response
//         res.status(200).json(hospitals);
//     } catch (error) {
//         next(error);
//     }
// };

export const getAllHospitals = async (req, res, next) => {
    try {
        const { services, location, morgue, typeOfhospital } = req.query;
        let filter = {};

        if (services) filter.services = services;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (morgue !== undefined) filter.morgue = morgue === 'true';
        if (typeOfhospital) filter.typeOfhospital = typeOfhospital;

        const hospitals = await HospitalModel.find(filter)
            .populate('hospitalname')
            .populate('phonenumber')
            .populate('hospitalemail')
            .populate('location')
            .populate('typeOfhospital')
            .populate('services')
            .populate('bedsAvailable')
            .populate('totalemergencyUnits')
            .populate('morgue')
            .populate('image')
            .populate('websiteLink')
            .populate('googleMapsLink');

        // Map the hospitals to only include the specified fields
        const hospitalResponses = hospitals.map(hospital => ({
            hospitalname: hospital.hospitalname,
            phonenumber: hospital.phonenumber,
            hospitalemail: hospital.hospitalemail,
            location: hospital.location,
            typeOfhospital: hospital.typeOfhospital,
            services: hospital.services,
            bedsAvailable: hospital.bedsAvailable,
            totalemergencyUnits: hospital.totalemergencyUnits,
            image: hospital.image,
            morgue: hospital.morgue,
            websiteLink: hospital.websiteLink,
            googleMapsLink: hospital.googleMapsLink
        }));

        // return response
        res.status(200).json(hospitalResponses);
    } catch (error) {
        next(error);
    }
};


// export const getHospital = async (req, res, next) => {
//     try {
//         const hospital = await HospitalModel.findById(req.params.id)
//             .populate('hospitalname')
//             .populate('phonenumber')
//             .populate('hospitalemail')
//             .populate('location')
//             .populate('typeOfhospital')
//             .populate('services')
//             .populate('bedsAvailable')
//             .populate('totalemergencyUnits')
//             .populate('morgue')
//             .populate('websiteLink')
//             .populate('googleMapsLink');

//         if (!hospital) {
//             return res.status(404).json({ message: 'Hospital not found' });
//         }

//         // Create a response object with only the specified fields
//         const hospitalResponse = {
//             hospitalname: hospital.hospitalname,
//             phonenumber: hospital.phonenumber,
//             hospitalemail: hospital.hospitalemail,
//             location: hospital.location,
//             typeOfhospital: hospital.typeOfhospital,
//             services: hospital.services,
//             bedsAvailable: hospital.bedsAvailable,
//             totalemergencyUnits: hospital.totalemergencyUnits,
//             morgue: hospital.morgue,
//             websiteLink: hospital.websiteLink,
//             googleMapsLink: hospital.googleMapsLink
//         };

//         // return response
//         res.status(200).json(hospitalResponse);
//     } catch (error) {
//         next(error);
//     }
// };


export const getHospital = async (req, res, next) => {
    try {
        const hospitalname = req.params.hospitalname; // Assuming the name is passed as a URL parameter

        const hospital = await HospitalModel.findOne({ hospitalname: hospitalname })
            .populate('hospitalname')
            .populate('phonenumber')
            .populate('hospitalemail')
            .populate('location')
            .populate('typeOfhospital')
            .populate('services')
            .populate('bedsAvailable')
            .populate('totalemergencyUnits')
            .populate('image')
            .populate('morgue')
            .populate('websiteLink')
            .populate('googleMapsLink');

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Create a response object with only the specified fields
        const hospitalResponse = {
            hospitalname: hospital.hospitalname,
            phonenumber: hospital.phonenumber,
            hospitalemail: hospital.hospitalemail,
            location: hospital.location,
            typeOfhospital: hospital.typeOfhospital,
            services: hospital.services,
            bedsAvailable: hospital.bedsAvailable,
            totalemergencyUnits: hospital.totalemergencyUnits,
            image: hospital.image,
            morgue: hospital.morgue,
            websiteLink: hospital.websiteLink,
            googleMapsLink: hospital.googleMapsLink
        };

        // return response
        res.status(200).json(hospitalResponse);
    } catch (error) {
        next(error);
    }
};




export const updateHospital = async (req, res, next) => {
    try {
        // Handle file upload if an image is provided
        const imagePath = req.file ? req.file.filename : undefined;
        const imageUrl = imagePath ? `${BASE_URL}${imagePath}` : undefined;

        // Create an object to hold the updated data
        const updateData = {
            ...req.body,
            image: imageUrl || req.body.image,  // Use the new image URL if available, otherwise keep the old one
            bedsAvailable: req.body.bedsAvailable ? Number(req.body.bedsAvailable) : undefined,
            totaldoctors: req.body.totaldoctors ? Number(req.body.totaldoctors) : undefined,
            totalnurses: req.body.totalnurses ? Number(req.body.totalnurses) : undefined,
            totalemergencyUnits: req.body.totalemergencyUnits ? Number(req.body.totalemergencyUnits) : undefined,
            morgue: req.body.morgue === 'true' || req.body.morgue === true
        };

        console.log('Hospital Data to be updated:', updateData);



        const { value, error } = updateHospitalValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        // Include image in the update if provided
        // if (req.body.image) {
        //     value.image = req.body.image;
        // }

        // Use findOneAndUpdate with the hospital name
        const hospital = await HospitalModel.findOneAndUpdate(
            { hospitalname: req.params.hospitalname },  // Find by hospital name
            value,
            { new: true }
        )
            .populate('totaldoctors', 'name specialization')
            .populate('totalnurses', 'name')
            .populate('image', 'image')
        // .populate('ambulances', 'vehiclenumber status');

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Return response with success message
        res.status(200).json({
            message: 'Hospital updated successfully',
            hospital: hospital
        });
    } catch (error) {
        next(error);
    }
};


// export const updateHospital = async (req, res, next) => {
//     try {
//         const { value, error } = updateHospitalValidator.validate(req.body);
//         if (error) {
//             return res.status(422).json(error);
//         }

//         // Include image in the update if provided
//         if (req.body.image) {
//             value.image = req.body.image;
//         }


//         const hospital = await HospitalModel.findByIdAndUpdate(req.params.id, value, { new: true })
//             .populate('totaldoctors', 'name specialization')
//             .populate('totalnurses', 'name')
//             .populate('ambulances', 'vehiclenumber status');

//         if (!hospital) {
//             return res.status(404).json({ message: 'Hospital not found' });
//         }


//         // return response
//         res.status(200).json(hospital);
//     } catch (error) {
//         next(error);
//     }
// };

// export const deleteHospital = async (req, res, next) => {
//     try {
//         const hospital = await HospitalModel.findOneAndDelete(req.params.id);
//         if (!hospital) {
//             return res.status(404).json({ message: 'Hospital not found' });
//         }

//         // return response
//         res.status(200).json({ message: 'Hospital deleted successfully' });
//     } catch (error) {
//         next(error);
//     }
// };
export const deleteHospital = async (req, res, next) => {
    try {
        const hospitalname = req.params.hospitalname;

        const deletedHospital = await HospitalModel.findOneAndDelete({ hospitalname: hospitalname });

        if (!deletedHospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        res.status(200).json({
            message: 'Hospital deleted successfully',
            deletedHospital: {
                hospitalname: deletedHospital.hospitalname,
                // You can include other fields you want to return here
            }
        });
    } catch (error) {
        next(error);
    }
};