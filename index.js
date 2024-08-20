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
import { refreshTokenRouter } from "./routes/refreshTokenRoute.route.js";
import { restartServer } from "./restart.server.js";



// Database connection
// dbConnection();

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


app.get("/api/v1/health", (req, res) => {
    res.json({ status: "UP" });
});


// Apply admin authentication middleware
app.use('/api/v1/admin', adminRouter);
app.use("/api/v1/users", userRouter);
app.use('/api/v1/hospitals', hospitalRouter);
app.use('/api/v1/ambulances', ambulanceRouter);
app.use('/api/v1/admin', refreshTokenRouter);
// app.use((req, res, next) => {
//     console.log('Request Body:', req.body);
//     next();
// });




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
app.use(errorHandler({ log: false }));

const reboot = async () => {
    setInterval(restartServer, process.env.INTERVAL)
};

// Listen for incoming requests
dbConnection()
  .then(() => {
    const PORT = process.env.PORT || 6010;
    app.listen(PORT, () => {
      reboot()
        .then(() => {
          console.log('Server Restarted');
        })
        .catch(error => {
          console.error('Error during reboot:', error);
        });
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(-1);
  });