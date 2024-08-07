import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import cors from "cors";
import { adminRouter } from "./routes/admin.route.js";
import { dbConnection } from "./config/database.js";
import { userRouter } from "./routes/user.route.js";
import dotenv from 'dotenv';
dotenv.config();
// import expressOasGenerator from "@mickeymond/express-oas-generator";
import expressOasGenerator from "express-oas-generator"
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



// Root route
// app.get('/', (req, res) => {
//     res.send('HealthConnect Backend is running');
//   });


// Router usage
app.use("/api/v1", adminRouter);
app.use("/api/v1", userRouter);


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

// Listen for incoming requests
const PORT = process.env.PORT || 6010;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});