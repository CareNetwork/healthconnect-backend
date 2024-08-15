import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import cors from "cors";
import errorHandler from "errorhandler";
import { adminRouter } from "./routes/admin.route.js";
import { dbConnection } from "./config/database.js";
import { userRouter } from "./routes/user.route.js";
import dotenv from 'dotenv';
dotenv.config();
// import expressOasGenerator from "@mickeymond/express-oas-generator";
import expressOasGenerator from "express-oas-generator"
import mongoose from "mongoose";
import { ambulanceRouter } from "./routes/ambulance.route.js";
import { hospitalRouter } from "./routes/hospital.route.js";
import { iSauthenticated } from "./middlewares/auth.js";



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





// Apply admin authentication middleware
app.use('/api/v1/admin', iSauthenticated, adminRouter);
app.use("/api/v1", userRouter);
app.use('/api/v1/hospitals', iSauthenticated, hospitalRouter);
app.use('/api/v1/ambulances', iSauthenticated, ambulanceRouter);





expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: ['admindashboard', 'hospital', 'ambulance'],
    mongooseModels: mongoose.modelNames(),
});



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


  expressOasGenerator.handleRequests();
  app.use((req, res) => res.redirect('/api-docs/'));
  app.use(errorHandler({log: false}));

// Listen for incoming requests
const PORT = process.env.PORT || 6010;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});