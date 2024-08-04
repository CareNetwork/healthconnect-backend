import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import { adminRouter } from "./routes/admin.route.js";
import { dbConnection } from "./config/database.js";
import { userRouter } from "./routes/user.route.js";

// Database connection
dbConnection();

// create an express app
const app = express();

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

// Router usage
app.use("/api/v1", adminRouter);
app.use("/api/v1", userRouter);






// Listen for incoming requests
const PORT = process.env.PORT || 6010;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});