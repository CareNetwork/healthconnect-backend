import { addAmbulanceValidator, updateAmbulanceValidator } from '../validation/ambulance.validation.js';
import { AmbulanceServiceModel } from '../models/ambulance.model.js';

export const addAmbulance = async (req, res, next) => {
    try {
        const { value, error } = addAmbulanceValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Assuming image URL is sent in the request body
        const ambulance = await AmbulanceServiceModel.create({
            ...value, 
            image: req.body.image});

        // return response
        res.status(201).json(ambulance);
    } catch (error) {
        next(error);
    }
};

export const getAllAmbulances = async (req, res, next) => {
    try {
        const { status, assignedHospital, populate } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (assignedHospital) filter.assignedHospital = assignedHospital;

        const defaultPopulate = { 
            path: "assignedHospital", 
            select: "hospitalname location phonenumber image" 
        };

        let query = AmbulanceServiceModel.find(filter);

        if (populate) {
            const populateOptions = JSON.parse(populate);
            query = query.populate(populateOptions);
        } else {
            query = query.populate(defaultPopulate);
        }

        const ambulances = await query.exec();
        res.status(200).json(ambulances);
    } catch (error) {
        next(error);
    }
};

export const getAmbulance = async (req, res, next) => {
    try {
        const ambulance = await AmbulanceServiceModel.findById(req.params.id)
            .populate('assignedHospital', 'hospitalname location phonenumber image');
        if (!ambulance) {
            return res.status(404).json({ message: 'Ambulance not found' });
        }
        res.status(200).json(ambulance);
    } catch (error) {
        next(error);
    }
};

export const updateAmbulance = async (req, res, next) => {
    try {
        const { value, error } = updateAmbulanceValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Include image in the update if provided
        if (req.body.image) {
            value.image = req.body.image;
        }
        const ambulance = await AmbulanceServiceModel.findByIdAndUpdate(req.params.id, value, { new: true })
            .populate('assignedHospital', 'hospitalname location phonenumber image');
        if (!ambulance) {
            return res.status(404).json({ message: 'Ambulance not found' });
        }
        res.status(200).json(ambulance);
    } catch (error) {
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