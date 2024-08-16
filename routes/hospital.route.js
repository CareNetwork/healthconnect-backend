import { Router } from "express";
import { addHospital, deleteHospital, getAllHospitals, getHospital, updateHospital } from "../controllers/hospital.controller.js";
import { remoteUpload, handleUploadError } from "../middlewares/uploads.js";




// Define the router
export const hospitalRouter = Router();


// Add a new hospital
hospitalRouter.post('/addhospitals', (req, res, next) => {
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
hospitalRouter.patch('/updatehospitals/:id', updateHospital);

// delete a hospital
hospitalRouter.delete('/hospitals/:id', deleteHospital);
