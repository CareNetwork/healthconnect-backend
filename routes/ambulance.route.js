import { Router } from "express";
import { addAmbulance, getAllAmbulances, getAmbulance, updateAmbulance, deleteAmbulance } from "../controllers/ambulance.controller.js";
import { remoteUpload, handleUploadError } from "../middlewares/uploads.js";




// Define the router
export const ambulanceRouter = Router();


// Add a new ambulance
ambulanceRouter.post('/addambulance', (req, res, next) => {
    remoteUpload(req, res, (err) => {
        if (err) { return handleUploadError(err, req, res, next); } next();
    });
}, addAmbulance);

// Get all ambulances
ambulanceRouter.get('/getallambulances', getAllAmbulances);

// Get a specific ambulance
ambulanceRouter.get('/:serviceprovider', getAmbulance);

// Update an ambulance
ambulanceRouter.patch('/:serviceprovider', (req, res, next) => {
    remoteUpload(req, res, (err) => {
        if (err) { return handleUploadError(err, req, res, next); } next();
    });
}, updateAmbulance);

// Delete a ambulance
ambulanceRouter.delete('/ambulances/:id', deleteAmbulance);