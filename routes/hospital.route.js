import { Router } from "express";
import { addHospital, deleteHospital, getAllHospitals, getHospital, updateHospital } from "../controllers/hospital.controller.js";
import { remoteUpload, handleUploadError } from "../middlewares/uploads.js";
import { iSauthenticated, authorized } from "../middlewares/auth.js";




// Define the router
export const hospitalRouter = Router();


// Add a new hospital
hospitalRouter.post('/addhospitals', iSauthenticated, authorized(['Admin']), (req, res, next) => {
    remoteUpload(req, res, (err) => {
        if (err) { return handleUploadError(err, req, res, next); } next();
    });
},
    addHospital
);

// Get all hospitals
hospitalRouter.get('/getallhospitals', getAllHospitals);

// Get a specific hospital
hospitalRouter.get('/:hospitalname', getHospital);

// Update a hospital
hospitalRouter.patch('/:hospitalname', iSauthenticated, authorized(['Admin']), (req, res, next) => {
    remoteUpload(req, res, (err) => {
        if (err) { return handleUploadError(err, req, res, next); } next();
    });
}, updateHospital);

// delete a hospital
hospitalRouter.delete('/:hospitalname', deleteHospital);
