import { Router } from "express";
import { Usersignup } from "../controllers/user.controller.js";



// Define router
export const userRouter = Router();


  // Signup route 
  userRouter.post("/users/signup", Usersignup);