import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import cors from "cors";
import { adminRouter } from "./routes/admin.route.js";
import { dbConnection } from "./config/database.js";
import { userRouter } from "./routes/user.route.js";
import "dotenv/config";
import expressOasGenerator from "@mickeymond/express-oas-generator";
import mongoose from "mongoose";

// Database connection
dbConnection();

// create an express app
const app = express();
app.use(cors({ credentials: true, origin: '*' }));

// Middleware
app.use(express.json()); // This should come before route definitions

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
        }),
    })
);

expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: ['admindashboard', 'hospital', 'ambulance'],
    mongooseModels: mongoose.modelNames(),
});


// Router usage
app.use("/api/v1", adminRouter);
app.use("/api/v1", userRouter);






// Listen for incoming requests
const PORT = process.env.PORT || 6010;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});