import { Router } from "express";
import { addHospital, deleteHospital, getAllHospitals, getHospital, updateHospital } from "../controllers/hospital.controller.js";




// Define the router
 export const hospitalRouter = Router();


 // Add a new hospital
 hospitalRouter.post('/addhospitals', addHospital);

// Get all hospitals
hospitalRouter.get('/getallhospitals', getAllHospitals);

// Get a specific hospital
hospitalRouter.get('/gethospitals/:id', getHospital);

// Update a hospital
hospitalRouter.patch('/updatehospitals/:id', updateHospital);

// delete a hospital
hospitalRouter.patch('/hospitals/:id', deleteHospital);
