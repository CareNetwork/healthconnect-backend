import { Router } from "express";
import { addAmbulance, getAllAmbulances, getAmbulance, updateAmbulance, deleteAmbulance } from "../controllers/ambulance.controller.js";




// Define the router
export const ambulanceRouter = Router();


// Add a new ambulance
ambulanceRouter.post('/hospitals', addAmbulance);

// Get all ambulances
ambulanceRouter.get('/hospitals', getAllAmbulances);

// Get a specific ambulance
ambulanceRouter.get('/hospitals/:id', getAmbulance);

// Update an ambulance
ambulanceRouter.patch('/hospitals/:id', updateAmbulance);

// Delete a ambulance
ambulanceRouter.delete('/hospitals/:id', deleteAmbulance);