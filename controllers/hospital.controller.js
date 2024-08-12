import { addHospitalValidator, updateHospitalValidator } from '../validation/hospital.validation.js';
import {HospitalModel} from '../models/hospital.model.js';

export const addHospital = async (req, res, next) => {
    try {
        const { value, error } = addHospitalValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        // Assuming image URL is sent in the request body
        const hospital = await HospitalModel.create({
            ...value, 
            image: req.body.image});

        // return response
        res.status(201).json(hospital);
    } catch (error) {
        next(error);
    }
};

export const getAllHospitals = async (req, res, next) => {
    try {
        const { servises, location, morgue, populate } = req.query;
        let filter = {};

        if (servises) filter.servises = servises;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (morgue !== undefined) filter.morgue = morgue === 'true';

        const defaultPopulate = [
            { path: "totaldoctors", select: "name specialization" },
            { path: "totalnurses", select: "name" },
            { path: "ambulances", select: "vehiclenumber status" }
        ];

        let query = HospitalModel.find(filter);

        if (populate) {
            const populateOptions = JSON.parse(populate);
            query = query.populate(populateOptions);
        } else {
            query = query.populate(defaultPopulate);
        }

        const hospitals = await query.exec();

        // return response
        res.status(200).json(hospitals);
    } catch (error) {
        next(error);
    }
};

export const getHospital = async (req, res, next) => {
    try {
        const hospital = await HospitalModel.findById(req.params.id)
            .populate('totaldoctors', 'name specialization')
            .populate('totalnurses', 'name')
            .populate('ambulances', 'vehiclenumber status');
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // return response
        res.status(200).json(hospital);
    } catch (error) {
        next(error);
    }
};

export const updateHospital = async (req, res, next) => {
    try {
        const { value, error } = updateHospitalValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        // Include image in the update if provided
        if (req.body.image) {
            value.image = req.body.image;
        }


        const hospital = await HospitalModel.findByIdAndUpdate(req.params.id, value, { new: true })
            .populate('totaldoctors', 'name specialization')
            .populate('totalnurses', 'name')
            .populate('ambulances', 'vehiclenumber status');

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }


        // return response
        res.status(200).json(hospital);
    } catch (error) {
        next(error);
    }
};

export const deleteHospital = async (req, res, next) => {
    try {
        const hospital = await HospitalModel.findByIdAndDelete(req.params.id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // return response
        res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        next(error);
    }
};