import { Router } from "express";
import { addHospital, deleteHospital, getAllHospitals, getHospital, updateHospital } from "../controllers/hospital.controller.js";




// Define the router
 export const hospitalRouter = Router();


 // Add a new hospital
 hospitalRouter.post('/hospitals', addHospital);

// Get all hospitals
hospitalRouter.get('/hospitals', getAllHospitals);

// Get a specific hospital
hospitalRouter.get('/hospitals/:id', getHospital);

// Update a hospital
hospitalRouter.patch('/hospitals/:id', updateHospital);

// delete a hospital
hospitalRouter.patch('/hospitals/:id', deleteHospital);