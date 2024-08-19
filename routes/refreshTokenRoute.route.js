import { Router } from "express";
import { refreshToken } from "../controllers/refreshtoken.controller.js";




// Define the router
export const refreshTokenRouter = Router();


refreshTokenRouter.post('/refresh-token', refreshToken);