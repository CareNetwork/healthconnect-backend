import { Router } from "express";
import { addAmbulance, getAllAmbulances, getAmbulance, updateAmbulance, deleteAmbulance } from "../controllers/ambulance.controller.js";




// Define the router
export const ambulanceRouter = Router();


// Add a new ambulance
ambulanceRouter.post('/addambulance', addAmbulance);

// Get all ambulances
ambulanceRouter.get('/ambulances', getAllAmbulances);

// Get a specific ambulance
ambulanceRouter.get('/ambulances/:id', getAmbulance);

// Update an ambulance
ambulanceRouter.patch('/ambulances/:id', updateAmbulance);

// Delete a ambulance
ambulanceRouter.delete('/ambulances/:id', deleteAmbulance);