import { Router } from "express";
import { Userlogin, Userlogout, Usersignup } from "../controllers/user.controller.js";
import { iSauthenticated } from "../middlewares/auth.js";
import { getAllAmbulances, getAmbulance,} from "../controllers/ambulance.controller.js";
import { getAllHospitals, getHospital } from "../controllers/hospital.controller.js";
import { hospitalRouter } from "./hospital.route.js";
import { ambulanceRouter } from "./ambulance.route.js";




// Define router
export const userRouter = Router();


  // User Signup route 
  userRouter.post("/users/signup", Usersignup);

  // User Login route
  userRouter.post("/users/login", Userlogin);

  // Get all hospitals with optional filtering
hospitalRouter.get('/users/hospitals', getAllHospitals);

// Get a specific hospital
hospitalRouter.get('/users/hospitals/:hospitalname', getHospital);

// Get all ambulances with optional filtering
ambulanceRouter.get('/ambulances', getAllAmbulances);

// Get a specific ambulance
ambulanceRouter.get('/ambulances/:id', getAmbulance);

  // Logout route (protected)
userRouter.post("/users/logout", iSauthenticated, Userlogout);