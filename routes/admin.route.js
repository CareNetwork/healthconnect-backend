import { Router } from "express";
import { logout, signup, token } from "../controllers/admin.controller.js";
// import { iSauthenticated } from "../middlewares/auth.js"




// Define router
export const adminRouter = Router();


  // Signup route 
  adminRouter.post("/admin/signup", signup);
  adminRouter.post("/admin/token",  token);
  adminRouter.post("/admin/logout",  logout);