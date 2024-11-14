import { addAmbulanceValidator, updateAmbulanceValidator } from '../validation/ambulance.validation.js';
import { AmbulanceServiceModel } from '../models/ambulance.model.js'; 

// export const addAmbulance = async (req, res, next) => {
//     try {
//         const { value, error } = addAmbulanceValidator.validate(req.body);
//         if (error) {
//             return res.status(422).json(error);
//         }
//         // Assuming image URL is sent in the request body
//         const ambulance = await AmbulanceServiceModel.create({
//             ...value, 
//             image: req.body.image});

//         // return response
//         res.status(201).json(ambulance);
//     } catch (error) {
//         next(error);
//     }
// };


const BASE_URL = 'https://savefiles.org/drive/s/Ti1dTmIpbSmJ3PnbOVf6hhDZnrh66u';


// 



export const addAmbulance = async (req, res, next) => {
    try {
        const imagePath = req.file ? req.file.filename : undefined;
        const imageUrl = imagePath ? `${BASE_URL}${imagePath}` : undefined;

        const ambulanceData = {
            ...req.body,
            image: imageUrl

        };

        console.log('Ambulance Data to be validated:', ambulanceData);

        // Validate the combined data
        const { error, value } = addAmbulanceValidator.validate(ambulanceData, { abortEarly: false });
        if (error) {
            return res.status(400).json({ error: error.details.map(detail => detail.message) });
        }


        // Destructure validated value
        const { serviceprovider, serviceprovideremail, } = value;


       // Check if an ambulance with the same email already exists
       const existingAmbulance = await AmbulanceServiceModel.findOne({ serviceprovider, serviceprovideremail });
       if (existingAmbulance) {
           return res.status(409).send("Ambulance service with this email already exists");
       }


        // Create new ambulance
        const newAmbulance = new AmbulanceServiceModel(value);
        await newAmbulance.save();

        // Respond with success
        return res.status(201).json({ message: "Ambulance added successfully", ambulance: newAmbulance });
    } catch (err) {
        // Handle unexpected errors
        console.error("Error adding ambulance:", err);
        return res.status(500).json({ error: "An error occurred while adding the ambulance" });
    }
};




// export const getAllAmbulances = async (req, res, next) => {
//     try {
//         const { status, assignedHospital, populate } = req.query;
//         let filter = {};

//         if (status) filter.status = status;
//         if (assignedHospital) filter.assignedHospital = assignedHospital;

//         const defaultPopulate = { 
//             path: "assignedHospital", 
//             select: "hospitalname location phonenumber image" 
//         };

//         let query = AmbulanceServiceModel.find(filter);

//         if (populate) {
//             const populateOptions = JSON.parse(populate);
//             query = query.populate(populateOptions);
//         } else {
//             query = query.populate(defaultPopulate);
//         }

//         const ambulances = await query.exec();
//         res.status(200).json(ambulances);
//     } catch (error) {
//         next(error);
//     }
// };


export const getAllAmbulances = async (req, res, next) => {
    try {
        const { serviceprovider, drivername, address, typeOfambulanceservice, status } = req.query;
        let filter = {};

        if (serviceprovider) filter.serviceprovider = { $regex: serviceprovider, $options: 'i' };
        if (drivername) filter.drivername = { $regex: drivername, $options: 'i' };
        if (address) filter.address = { $regex: address, $options: 'i' };
        if (typeOfambulanceservice) filter.typeOfambulanceservice = typeOfambulanceservice;
        if (status) filter.status = status;

        const ambulances = await AmbulanceServiceModel.find(filter)
            .populate('serviceprovider')
            .populate('serviceprovidercontactnumber')
            .populate('serviceprovideremail')
            .populate('vehiclenumber')
            .populate('vehiclenumber')
            .populate('drivername')
            .populate('drivercontactnumber')
            .populate('typeOfambulanceservice')
            .populate('address')
            .populate('status')
            .populate('assignedHospital')
            .populate('image')
            .populate('googleMapsLink')
            .populate('websiteLink');

        // Map the ambulances to only include the specified fields
        const ambulanceResponses = ambulances.map(ambulance => ({
            serviceprovider: ambulance.serviceprovider,
            serviceprovidercontactnumber: ambulance.serviceprovidercontactnumber,
            serviceprovideremail: ambulance.serviceprovideremail,
            vehiclenumber: ambulance.vehiclenumber,
            drivername: ambulance.drivername,
            drivercontactnumber: ambulance.drivercontactnumber,
            typeOfambulanceservice: ambulance.typeOfambulanceservice,
            address: ambulance.address,
            status: ambulance.status,
            assignedHospital: ambulance.assignedHospital,
            image: ambulance.image,
            googleMapsLink: ambulance.googleMapsLink,
            websiteLink: ambulance.websiteLink
        }));

        // Return response
        res.status(200).json(ambulanceResponses);
    } catch (error) {
        next(error);
    }
};




export const getAmbulance = async (req, res, next) => {
    try {
        const serviceprovider = req.params.serviceprovider; // Assuming the service provider is passed as a URL parameter

        const ambulance = await AmbulanceServiceModel.findOne({ serviceprovider })
            .populate('serviceprovider') // If serviceprovider is a reference, populate it
            .populate('serviceprovidercontactnumber') // If this is a reference, populate it
            .populate('serviceprovideremail') // If this is a reference, populate it
            .populate('drivername') // If this is a reference, populate it
            .populate('drivercontactnumber') // If this is a reference, populate it
            .populate('typeOfambulanceservice') // If this is a reference, populate it
            .populate('address') // If this is a reference, populate it
            .populate('status') // If this is a reference, populate it
            .populate('assignedHospital') // Populate assigned hospital details
            .populate('image') // Assuming this is a URL
            .populate('googleMapsLink') // Assuming this is a URL
            .populate('websiteLink'); // Assuming this is a URL

        if (!ambulance) {
            return res.status(404).json({ message: 'Ambulance not found' });
        }

        // Create a response object with only the specified fields
        const ambulanceResponse = {
            serviceprovider: ambulance.serviceprovider,
            serviceprovidercontactnumber: ambulance.serviceprovidercontactnumber,
            serviceprovideremail: ambulance.serviceprovideremail,
            vehiclenumber: ambulance.vehiclenumber,
            drivername: ambulance.drivername,
            drivercontactnumber: ambulance.drivercontactnumber,
            typeOfambulanceservice: ambulance.typeOfambulanceservice,
            address: ambulance.address,
            status: ambulance.status,
            assignedHospital: ambulance.assignedHospital,
            image: ambulance.image,
            googleMapsLink: ambulance.googleMapsLink,
            websiteLink: ambulance.websiteLink
        };

        // Return response
        res.status(200).json(ambulanceResponse);
    } catch (error) {
        next(error);
    }
};


// export const updateAmbulance = async (req, res, next) => {
//     try {
//         const { value, error } = updateAmbulanceValidator.validate(req.body);
//         if (error) {
//             return res.status(422).json(error);
//         }
//         // Include image in the update if provided
//         if (req.body.image) {
//             value.image = req.body.image;
//         }
//         const ambulance = await AmbulanceServiceModel.findByIdAndUpdate(req.params.id, value, { new: true })
//             .populate('assignedHospital', 'hospitalname location phonenumber image');
//         if (!ambulance) {
//             return res.status(404).json({ message: 'Ambulance not found' });
//         }
//         res.status(200).json(ambulance);
//     } catch (error) {
//         next(error);
//     }
// };


export const updateAmbulance = async (req, res, next) => {
    try {
        const serviceprovider = req.params.serviceprovider; // Assuming the service provider is passed as a URL parameter

        // Handle image update if a new image is provided
        let imageUrl;
        if (req.file) {
            const imagePath = req.file.filename;
            imageUrl = `${BASE_URL}${imagePath}`;
        }

        // Prepare update data
        const updateData = {
            ...(req.body.serviceprovider && { serviceprovider: req.body.serviceprovider }),
            ...(req.body.serviceprovidercontactnumber && { serviceprovidercontactnumber: req.body.serviceprovidercontactnumber }),
            ...(req.body.serviceprovideremail && { serviceprovideremail: req.body.serviceprovideremail }),
            ...(req.body.drivername && { drivername: req.body.drivername }),
            ...(req.body.drivercontactnumber && { drivercontactnumber: req.body.drivercontactnumber }),
            ...(req.body.typeOfambulanceservice && { typeOfambulanceservice: req.body.typeOfambulanceservice }),
            ...(req.body.address && { address: req.body.address }),
            ...(req.body.status && { status: req.body.status }),
            ...(req.body.assignedHospital && { assignedHospital: req.body.assignedHospital }),
            ...(imageUrl && { image: imageUrl }),
            ...(req.body.googleMapsLink && { googleMapsLink: req.body.googleMapsLink }),
            ...(req.body.websiteLink && { websiteLink: req.body.websiteLink }),
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        console.log('Ambulance Data to be updated:', updateData);

        // Validate the update data
        const { error, value } = updateAmbulanceValidator.validate(updateData);
        if (error) {
            return res.status(422).json(error);
        }

        // Use findOneAndUpdate with the service provider
        const ambulance = await AmbulanceServiceModel.findOneAndUpdate(
            { serviceprovider: serviceprovider },
            value,
            { new: true, runValidators: true }
        );

        if (!ambulance) {
            return res.status(404).json({ message: 'Ambulance not found' });
        }

        // Return response with success message
        res.status(200).json({
            message: 'Ambulance updated successfully',
            ambulance: ambulance
        });
    } catch (error) {
        console.error("Error updating ambulance:", error);
        next(error);
    }
};


export const deleteAmbulance = async (req, res, next) => {
    try {
        const ambulance = await AmbulanceServiceModel.findByIdAndDelete(req.params.id);
        if (!ambulance) {
            return res.status(404).json({ message: 'Ambulance not found' });
        }

        // return response
        res.status(200).json({ message: 'Ambulance deleted successfully' });
    } catch (error) {
        next(error);
    }
};