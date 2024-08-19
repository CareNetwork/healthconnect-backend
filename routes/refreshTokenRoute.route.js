import { Router } from "express";
import { refreshToken } from "../middlewares/auth.js";




// Define the router
export const refreshTokenRouter = Router();


refreshTokenRouter.post('/refreshtoken', refreshToken);