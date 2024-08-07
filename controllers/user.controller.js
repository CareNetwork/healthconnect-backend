import { UserModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BlacklistedTokenModel } from "../models/blacklistedToken.model.js";





export const Usersignup = async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;

        // Validate input
        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate email format (basic check)
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(email)) {
        //     return res.status(400).json({ message: "Invalid email format" });
        // }

        // Check if a user already exists with the provided email or username
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or username" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error in user signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// this is for the user login
export const Userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '72h' }
        );

        res.status(200).json({
            message: "Your Login was successful",
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const Userlogout = async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        console.log('Auth Header:', authHeader);

        const token = authHeader?.replace('Bearer ', '');
        console.log('Extracted Token:', token);

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        // Add the token to a blacklist
        const blacklistedToken = new BlacklistedTokenModel({
            token: token
        });

        await blacklistedToken.save();

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in user logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};