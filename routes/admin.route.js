import { Router } from "express";
import { logout, signup, token } from "../controllers/admin.controller.js";





// Define router
export const adminRouter = Router();


  // Signup route 
  adminRouter.post("/signup", signup);
  adminRouter.post("/token",  token);
  adminRouter.post("/logout",  logout);