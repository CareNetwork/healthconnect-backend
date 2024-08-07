import { Router } from "express";
import { Userlogin, Userlogout, Usersignup } from "../controllers/user.controller.js";
import { iSauthenticated } from "../middlewares/auth.js";




// Define router
export const userRouter = Router();


  // User Signup route 
  userRouter.post("/users/signup", Usersignup);

  // User Login route
  userRouter.post("/users/login", Userlogin);

  // Logout route (protected)
userRouter.post("/users/logout", iSauthenticated, Userlogout);