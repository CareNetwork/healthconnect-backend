import { Router } from "express";
import { Userlogin, Userlogout, Usersignup } from "../controllers/user.controller.js";
import { iSauthenticated } from "../middlewares/auth.js";
import { getAllAmbulances, getAmbulance,} from "../controllers/ambulance.controller.js";
import { getAllHospitals, getHospital } from "../controllers/hospital.controller.js";





// Define router
export const userRouter = Router();


  // User Signup route 
  userRouter.post("/signup", Usersignup);

  // User Login route
  userRouter.post("/login", Userlogin);

  // Get all hospitals with optional filtering
userRouter.get('/hospitals/getallhospitals', getAllHospitals);

// Get a specific hospital
userRouter.get('/hospitals/:hospitalname', getHospital);

// Get all ambulances with optional filtering
userRouter.get('/ambulances', getAllAmbulances);

// Get a specific ambulance
userRouter.get('/ambulances/:id', getAmbulance);

  // Logout route (protected)
userRouter.post("/logout", iSauthenticated, Userlogout);